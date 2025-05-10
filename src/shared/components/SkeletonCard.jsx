/**
 * SkeletonCard — animated pulse placeholder for RecipeCard.
 *
 * Matches RecipeCard's structure exactly:
 *  - aspect-[4/3] image area
 *  - content block with title bar, meta row, and tag chips
 *
 * Uses animate-pulse + bg-neutral-200 / dark:bg-neutral-700 for the
 * shimmer effect. No extra libraries needed — Tailwind handles it.
 *
 * Used in RecipeListPage while recipes are loading.
 */
export default function SkeletonCard() {
  return (
    <div
      className="flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-neutral-200 dark:bg-neutral-800 dark:ring-neutral-700"
      aria-hidden="true"
    >
      {/* Image placeholder */}
      <div className="aspect-[4/3] w-full animate-pulse bg-neutral-200 dark:bg-neutral-700" />

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        {/* Title bar */}
        <div className="h-4 w-3/4 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700" />
        {/* Second title line (simulates two-line clamp) */}
        <div className="h-4 w-1/2 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700" />

        {/* Meta row — cuisine + time */}
        <div className="h-3 w-1/3 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700" />

        {/* Tag chips */}
        <div className="mt-auto flex gap-1 pt-1">
          <div className="h-5 w-12 animate-pulse rounded-full bg-neutral-200 dark:bg-neutral-700" />
          <div className="h-5 w-16 animate-pulse rounded-full bg-neutral-200 dark:bg-neutral-700" />
          <div className="h-5 w-10 animate-pulse rounded-full bg-neutral-200 dark:bg-neutral-700" />
        </div>
      </div>
    </div>
  )
}
