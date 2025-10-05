import { createContext, useCallback, useContext, useMemo, useState } from 'react'

type Toast = { id: number; title?: string; description?: string; variant?: 'default' | 'success' | 'error' }

type ToastContextType = {
  toasts: Toast[]
  show: (t: Omit<Toast, 'id'>) => void
  remove: (id: number) => void
  success: (msg: string, title?: string) => void
  error: (msg: string, title?: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const remove = useCallback((id: number) => setToasts(ts => ts.filter(t => t.id !== id)), [])
  const show = useCallback((t: Omit<Toast, 'id'>) => {
    const id = Date.now() + Math.random()
    setToasts(ts => [...ts, { id, ...t }])
    setTimeout(() => remove(id), 4000)
  }, [remove])
  const success = useCallback((msg: string, title?: string) => show({ variant: 'success', description: msg, title }), [show])
  const error = useCallback((msg: string, title?: string) => show({ variant: 'error', description: msg, title }), [show])
  const value = useMemo(() => ({ toasts, show, remove, success, error }), [toasts, show, remove, success, error])
  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toaster toasts={toasts} remove={remove} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

export function Toaster({ toasts, remove }: { toasts: Toast[]; remove: (id: number) => void }) {
  return (
    <div className="fixed right-4 top-4 z-50 flex flex-col gap-2">
      {toasts.map(t => (
        <div key={t.id} className={`min-w-64 max-w-96 rounded border p-3 shadow bg-white ${t.variant === 'success' ? 'border-green-500' : t.variant === 'error' ? 'border-red-500' : ''}`}>
          {t.title && <div className="font-semibold mb-1">{t.title}</div>}
          {t.description && <div className="text-sm">{t.description}</div>}
          <button className="text-xs text-gray-500 mt-1" onClick={() => remove(t.id)}>Close</button>
        </div>
      ))}
    </div>
  )
}


