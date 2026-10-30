create table if not exists public.galeria_proyectos (
  id uuid primary key default gen_random_uuid(),
  proyecto_id uuid not null unique references public.proyectos(id) on delete cascade,
  nombre text not null,
  fotos jsonb not null default '[]'::jsonb,
  videos jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.galeria_proyectos enable row level security;

drop policy if exists galeria_proyectos_authenticated on public.galeria_proyectos;
create policy galeria_proyectos_authenticated
  on public.galeria_proyectos
  for all
  to authenticated
  using (true)
  with check (true);

revoke all on public.galeria_proyectos from anon, public;
grant select, insert, update, delete on public.galeria_proyectos to authenticated;

insert into storage.buckets (id, name, public)
values ('gallery-media', 'gallery-media', false)
on conflict (id) do update set public = false;

drop policy if exists gallery_media_select on storage.objects;
create policy gallery_media_select
  on storage.objects
  for select
  to authenticated
  using (bucket_id = 'gallery-media');

drop policy if exists gallery_media_insert on storage.objects;
create policy gallery_media_insert
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'gallery-media');

drop policy if exists gallery_media_update on storage.objects;
create policy gallery_media_update
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'gallery-media')
  with check (bucket_id = 'gallery-media');

drop policy if exists gallery_media_delete on storage.objects;
create policy gallery_media_delete
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'gallery-media');

do $$
begin
  alter publication supabase_realtime add table public.galeria_proyectos;
exception
  when duplicate_object then null;
end $$;
