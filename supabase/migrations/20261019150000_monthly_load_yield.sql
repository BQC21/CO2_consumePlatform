alter table public.registros_mensuales
  add column if not exists rendimiento_carga numeric;
