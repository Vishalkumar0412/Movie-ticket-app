export function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-gray-200 ${className || ''}`}></div>
}

export function CardsSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="border rounded p-2 space-y-2">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  )
}


