
// Skeleton de las tarjetas de métricas
export function MetricCardsSkeleton() {
  return (
    // Skeleton de las métricas
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3" aria-hidden="true">
      {Array.from({ length: 3 }, (_, index) => (
        <article key={index} className="rounded-3xl bg-white px-5 py-4">
          <div className="skeleton h-3 w-32 rounded-full" />
          <div className="skeleton mt-3 h-10 w-24 rounded-full" />
          <div className="skeleton mt-3 h-4 w-40 rounded-full" />
        </article>
      ))}
    </div>
  );
}

// Skeleton de la tarjeta de Galería
export function ImageCardSkeleton() {
  return (
    <article className="rounded-3xl bg-white p-5" aria-hidden="true">
      <div className="skeleton h-3 w-24 rounded-full" />
      <div className="skeleton mt-3 h-7 w-40 rounded-full" />
      <div className="skeleton mt-4 aspect-[4/3] rounded-2xl" />
    </article>
  );
}

// Skeleton de la tarjeta de departamento
export function DepartmentCardSkeleton() {
  return (
    <article className="rounded-3xl bg-white p-5" aria-hidden="true">
      <div className="skeleton h-3 w-32 rounded-full" />
      <div className="skeleton mt-3 h-4 w-full rounded-full" />
      <div className="skeleton mt-3 h-10 rounded-xl" />
      <div className="skeleton mt-3 h-16 rounded-xl" />
      <div className="skeleton mt-3 h-16 rounded-xl" />
    </article>
  );
}