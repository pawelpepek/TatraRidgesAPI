#!/usr/bin/env bash
# Copies the production data (schema public, without "Users" and admins) into the local Supabase
# database, replacing what is there. Production is only read: every session runs with
# default_transaction_read_only=on.
#
#   npm run db:import-prod            # check, then import
#   npm run db:import-prod -- --check # only compare schemas and count rows
#
# The connection string is read from TatraRidgesAPI/appsettings.json (ignored by git)
# unless PROD_DB_CONNECTION is set. The password is passed through the environment and
# never printed. Run it while `npm run db:start` is running.
set -euo pipefail
cd "$(dirname "$0")/.."

LOCAL_DB=supabase_db_tatra-ridges
DUMP=/tmp/prod-data.sql

if [ -z "${PROD_DB_CONNECTION:-}" ] && [ ! -f TatraRidgesAPI/appsettings.json ]; then
	echo "Brak TatraRidgesAPI/appsettings.json: ustaw PROD_DB_CONNECTION (Host=...;Port=...;Database=...;Username=...;Password=...)." >&2
	exit 1
fi

connection=${PROD_DB_CONNECTION:-$(python3 -c '
import json
with open("TatraRidgesAPI/appsettings.json", encoding="utf-8-sig") as f:
    print(json.load(f)["ConnectionStrings"]["TatraDbConnection"])
')}

# Npgsql "Key=Value;..." to libpq environment variables.
while IFS='=' read -r key value; do
	case "${key,,}" in
		host) export PGHOST=$value ;;
		port) export PGPORT=$value ;;
		database) export PGDATABASE=$value ;;
		username | "user id") export PGUSER=$value ;;
		password) export PGPASSWORD=$value ;;
	esac
done < <(tr ';' '\n' <<<"$connection")
export PGSSLMODE=require
export PGOPTIONS='-c default_transaction_read_only=on'

# Tools from the local database container; -e NAME passes the variable without its value on the command line.
prod() { docker exec -i -e PGHOST -e PGPORT -e PGDATABASE -e PGUSER -e PGPASSWORD -e PGSSLMODE -e PGOPTIONS "$LOCAL_DB" "$@"; }
local_psql() { docker exec -i "$LOCAL_DB" psql -U postgres -v ON_ERROR_STOP=1 "$@"; }

# Only the tables that exist on production are compared (local migrations may be ahead).
prod_tables=$(prod psql -At -c "select string_agg(tablename, ',') from pg_tables where schemaname = 'public'")
columns_query="select table_name || '.' || column_name || ' ' || data_type || ' ' || is_nullable
from information_schema.columns where table_schema = 'public'
and table_name = any (string_to_array('$prod_tables', ','))
order by 1"

echo "Produkcja: $(prod psql -At -c 'show server_version')"

if ! diff <(prod psql -At -c "$columns_query") <(local_psql -At -c "$columns_query") >/tmp/schema-diff.txt; then
	echo "Schemat produkcji różni się od lokalnego (< produkcja, > lokalnie):"
	cat /tmp/schema-diff.txt
	exit 1
fi
echo "Schemat tabel zgodny z lokalnym."

counts_query="select format('%s: %s', table_name,
	(xpath('/row/c/text()', query_to_xml(format('select count(*) as c from public.%I', table_name), false, true, '')))[1]::text)
from information_schema.tables where table_schema = 'public' and table_type = 'BASE TABLE' order by 1"
echo "Liczba wierszy na produkcji:"
prod psql -At -c "$counts_query" | sed 's/^/  /'

if [ "${1:-}" = "--check" ]; then
	exit 0
fi

# public.admins refers to auth.users, which differ between the databases: it stays local
# (the local admin comes from seed.sql).
prod pg_dump --data-only --schema=public --exclude-table-data='public."Users"' \
	--exclude-table-data=public.admins --no-owner --no-privileges -f "$DUMP"

local_psql -q -c "set client_min_messages = warning;" -c "do \$\$ declare t text; begin
	for t in select tablename from pg_tables where schemaname = 'public' and tablename <> 'admins' loop
		execute format('truncate table public.%I restart identity cascade', t);
	end loop;
end \$\$;"
local_psql -q --single-transaction -f "$DUMP" >/dev/null
docker exec "$LOCAL_DB" rm -f "$DUMP"

# On production the identity sequences lag far behind the largest ids (the data was
# loaded with explicit ids), so new rows would hit existing ids. Fix it locally.
local_psql -q -c "do \$\$ declare t text; m bigint; begin
	for t in select table_name from information_schema.columns
		where table_schema = 'public' and column_name = 'Id' and is_identity = 'YES' loop
		execute format('select max(\"Id\") from public.%I', t) into m;
		perform setval(pg_get_serial_sequence(format('public.%I', t), 'Id'), coalesce(m, 1), m is not null);
	end loop;
end \$\$;"

echo "Zaimportowano. Liczba wierszy lokalnie:"
local_psql -At -c "$counts_query" | sed 's/^/  /'
