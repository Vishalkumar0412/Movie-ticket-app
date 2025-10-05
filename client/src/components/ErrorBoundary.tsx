import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary'
import { Button } from '@/components/ui/button'

function ErrorFallback({ error, resetErrorBoundary }: { error: Error, resetErrorBoundary: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-4 text-center">
        <div className="text-red-600 text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-semibold text-gray-900">Oops! Something went wrong</h2>
        <p className="text-gray-600 mb-4">{error.message}</p>
        <div className="space-x-4">
          <Button 
            onClick={resetErrorBoundary}
            variant="outline"
          >
            Try again
          </Button>
          <Button 
            onClick={() => window.location.href = '/'}
            variant="default"
          >
            Go to Home
          </Button>
        </div>
      </div>
    </div>
  )
}

export function ErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // Reset app state here if needed
      }}
    >
      {children}
    </ReactErrorBoundary>
  )
}