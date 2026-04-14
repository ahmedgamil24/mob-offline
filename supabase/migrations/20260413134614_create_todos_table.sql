create table todos (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  is_completed boolean default false,
  created_at timestamp default now()
);