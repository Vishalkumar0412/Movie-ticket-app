import { cn } from "@/lib/utils"

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
  return (
    <div
      className={cn(
        "inline-block animate-spin rounded-full border-2 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]",
        {
          'h-4 w-4': size === 'sm',
          'h-6 w-6': size === 'md',
          'h-8 w-8': size === 'lg',
        },
        className
      )}
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}

export function PageSpinner() {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <Spinner size="lg" className="text-blue-600" />
    </div>
  )
}

interface CardSkeletonProps {
  count?: number
}

export function CardSkeleton({ count = 1 }: CardSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div 
          key={i}
          className="rounded-lg bg-white shadow-sm border p-4 animate-pulse"
        >
          <div className="h-48 bg-gray-200 rounded-md mb-4" />
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      ))}
    </>
  )
}

export function FormSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/4" />
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-1/4" />
        <div className="h-10 bg-gray-200 rounded" />
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-1/4" />
        <div className="h-10 bg-gray-200 rounded" />
      </div>
      <div className="h-10 bg-gray-200 rounded w-full" />
    </div>
  )
}