alter table public.proyectos add column if not exists insercion text not null default 'independiente';
alter table public.proyectos add column if not exists portal_proyecto_id integer;
alter table public.proyectos add column if not exists imagen_url text;

alter table public.proyectos drop constraint if exists proyectos_insercion_check;
alter table public.proyectos
  add constraint proyectos_insercion_check check (insercion in ('independiente', 'existente'));

insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', true)
on conflict (id) do update set public = true;
