alter table todos enable row level security;

create policy "Allow read"
on todos
for select
using (true);

create policy "Allow insert"
on todos
for insert
with check (true);

create policy "Allow update"
on todos
for update
using (true);

create policy "Allow delete"
on todos
for delete
using (true);