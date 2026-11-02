-- One-off data fix for production (2026-10): the identity sequences of the tables in
-- public lag far behind the largest ids, because the data was loaded with explicit ids.
-- Moves every sequence so the next generated id is max("Id") + 1. A sequence that is
-- already further ahead is left alone, and empty tables are skipped. Safe to run again.

begin;

do $$
declare
	t record;
	max_id bigint;
	current_value bigint;
begin
	for t in
		select c.table_name,
			pg_get_serial_sequence(format('public.%I', c.table_name), 'Id') as sequence_name
		from information_schema.columns c
		where c.table_schema = 'public' and c.column_name = 'Id' and c.is_identity = 'YES'
		order by c.table_name
	loop
		execute format('select max("Id") from public.%I', t.table_name) into max_id;

		select s.last_value into current_value
		from pg_sequences s
		where format('%I.%I', s.schemaname, s.sequencename) = t.sequence_name;

		if max_id is not null and max_id > coalesce(current_value, 0) then
			perform setval(t.sequence_name, max_id, true);
			raise notice '%: % -> % (next id %)', t.table_name, current_value, max_id, max_id + 1;
		else
			raise notice '%: % unchanged (max id %)', t.table_name, current_value, max_id;
		end if;
	end loop;
end $$;

commit;
