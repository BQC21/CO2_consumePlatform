alter table public.proyectos add column if not exists marca_panel text not null default '';
alter table public.proyectos add column if not exists marca_bateria text not null default '';

create table if not exists public.registros_mensuales (
  id uuid primary key default gen_random_uuid(),
  proyecto_id uuid not null references public.proyectos(id) on delete cascade,
  mes date not null,
  rendimiento_fv numeric,
  rendimiento_grid numeric,
  reduccion_co2 numeric,
  reduccion_carbon numeric,
  arboles numeric,
  unique (proyecto_id, mes)
);

alter table public.registros_mensuales enable row level security;

drop policy if exists registros_mensuales_authenticated on public.registros_mensuales;
create policy registros_mensuales_authenticated
  on public.registros_mensuales
  for all
  to authenticated
  using (true)
  with check (true);

revoke all on public.registros_mensuales from anon, public;
grant select, insert, update, delete on public.registros_mensuales to authenticated;
