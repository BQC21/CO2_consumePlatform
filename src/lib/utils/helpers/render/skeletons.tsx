export function MetricCardsSkeleton() {
  return (
    // Skeleton de las métricas
    <div className="grid gap-3" aria-hidden="true">
      {/* Skeleton de la tarjeta de arriba */}
      <article className="rounded-2xl bg-white px-5 py-4">
        <div className="skeleton h-6 w-36 rounded-full" />
        <div className="skeleton mt-4 h-4 w-40 rounded-full" />
        <div className="skeleton mt-3 h-8 w-24 rounded-full" />
      </article>
      {/* Skeleton de las dos tarjetas */}
      <div className="grid grid-cols-2 gap-3">
        {/* Skeleton de la primera tarjeta */}
        <article className="rounded-2xl bg-white px-4 py-4">
          <div className="skeleton h-4 w-24 rounded-full" />
          <div className="skeleton mt-4 h-8 w-28 rounded-full" />
        </article>
        {/* Skeleton de la segunda tarjeta */}
        <article className="rounded-2xl bg-white px-4 py-4">
          <div className="skeleton h-4 w-28 rounded-full" />
          <div className="skeleton mt-4 h-8 w-24 rounded-full" />
        </article>
      </div>
    </div>
  );
}

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