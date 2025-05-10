import { Toaster } from 'react-hot-toast'
import AppRouter from './router/index'
import { ErrorBoundary } from '../shared/components'

/**
 * App — top-level component.
 * Renders the router wrapped in a global ErrorBoundary, and mounts the
 * global toast notification container.
 * Auth state is provided by AuthProvider in main.jsx.
 */
export default function App() {
  return (
    <ErrorBoundary>
      <AppRouter />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
          },
        }}
      />
    </ErrorBoundary>
  )
}
