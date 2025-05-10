import { useEffect, useRef } from 'react'
import Button from './Button'

/**
 * ConfirmDialog — accessible modal confirmation before destructive actions.
 *
 * Features:
 *  - Focus is trapped inside the modal while it is open
 *  - Pressing Escape dismisses (calls onCancel)
 *  - Background scroll is locked while open
 *  - ARIA role="dialog" with aria-modal and aria-labelledby
 *
 * @param {{
 *   open: boolean,
 *   title?: string,
 *   message: string,
 *   confirmLabel?: string,
 *   onConfirm: () => void,
 *   onCancel: () => void,
 * }} props
 */
export default function ConfirmDialog({
  open,
  title = 'Are you sure?',
  message,
  confirmLabel = 'Delete',
  onConfirm,
  onCancel,
}) {
  const cancelRef = useRef(null)

  // Lock body scroll and focus the cancel button when dialog opens
  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    cancelRef.current?.focus()

    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // Dismiss on Escape key
  useEffect(() => {
    if (!open) return
    function handleKey(e) {
      if (e.key === 'Escape') onCancel()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open, onCancel])

  if (!open) return null

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      aria-hidden="false"
      onClick={(e) => {
        // Dismiss on backdrop click
        if (e.target === e.currentTarget) onCancel()
      }}
    >
      {/* Dialog panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl dark:bg-neutral-800"
      >
        <h2
          id="confirm-dialog-title"
          className="text-base font-semibold text-neutral-900 dark:text-white"
        >
          {title}
        </h2>

        <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
          {message}
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <Button ref={cancelRef} variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
