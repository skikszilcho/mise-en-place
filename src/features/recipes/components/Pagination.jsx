/**
 * Pagination — Previous / page numbers / Next controls.
 *
 * Shows at most 5 page number buttons centred on the current page, with
 * ellipsis indicators when pages are skipped. Previous and Next are always
 * rendered and are disabled at the boundaries.
 *
 * @param {{
 *   totalPages: number,
 *   currentPage: number,
 *   onPageChange: (page: number) => void,
 * }} props
 */
export default function Pagination({ totalPages, currentPage, onPageChange }) {
  if (totalPages <= 1) return null

  // Build the window of page numbers to show: up to 5, centred on currentPage
  function getPageNumbers() {
    const delta = 2
    const start = Math.max(1, currentPage - delta)
    const end   = Math.min(totalPages, currentPage + delta)
    const pages = []

    if (start > 1) {
      pages.push(1)
      if (start > 2) pages.push('…')
    }

    for (let i = start; i <= end; i++) pages.push(i)

    if (end < totalPages) {
      if (end < totalPages - 1) pages.push('…')
      pages.push(totalPages)
    }

    return pages
  }

  const pages = getPageNumbers()

  const btnBase =
    'inline-flex h-9 min-w-[2.25rem] items-center justify-center rounded-lg px-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-40'

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-1">
      {/* Previous */}
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
        className={`${btnBase} text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-700`}
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Page numbers / ellipsis */}
      {pages.map((page, i) =>
        typeof page === 'string' ? (
          <span
            key={`ellipsis-${i}`}
            className="inline-flex h-9 w-9 items-center justify-center text-sm text-neutral-400"
            aria-hidden="true"
          >
            {page}
          </span>
        ) : (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            aria-label={`Page ${page}`}
            aria-current={page === currentPage ? 'page' : undefined}
            className={`${btnBase} ${
              page === currentPage
                ? 'bg-primary-600 text-white'
                : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-700'
            }`}
          >
            {page}
          </button>
        )
      )}

      {/* Next */}
      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
        className={`${btnBase} text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-700`}
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </nav>
  )
}
