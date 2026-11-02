#!/usr/bin/env bash
# Starts the local Supabase inside WSL and keeps this WSL session open.
# WSL stops the distribution (and Docker with it) when no session is open, so the
# database is available only while this script runs. Stop it with Ctrl+C.
set -u
cd "$(dirname "$0")/.."

# When WSL starts, Docker restarts the containers by itself; wait until the database is up.
for _ in $(seq 1 90); do
	state=$(docker inspect -f '{{.State.Health.Status}}' supabase_db_tatra-ridges 2>/dev/null || echo missing)
	[ "$state" = "starting" ] || break
	sleep 2
done

if ! supabase status >/dev/null 2>&1; then
	supabase start || exit 1
fi

supabase status
echo
echo "Supabase działa. Zostaw ten terminal otwarty; Ctrl+C kończy sesję WSL."
exec sleep infinity
