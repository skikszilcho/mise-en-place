import { Link } from 'react-router-dom'
import { ROUTES } from '../../../config/routes'

/**
 * RecipeCard — displays a recipe summary in the list grid.
 *
 * The entire card is a navigable link to the recipe detail page.
 * Shows: title, cuisine, total time, and up to 3 tag chips.
 *
 * @param {{ recipe: object }} props
 */
export default function RecipeCard({ recipe }) {
  const {
    id,
    title,
    cuisine,
    tags = [],
    prep_time_min,
    cook_time_min,
    image_url,
  } = recipe

  const totalTime = (prep_time_min ?? 0) + (cook_time_min ?? 0)
  const visibleTags = tags.slice(0, 3)
  const extraTags = tags.length - visibleTags.length

  return (
    <Link
      to={ROUTES.RECIPE_DETAIL(id)}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-neutral-200 transition-shadow hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:bg-neutral-800 dark:ring-neutral-700"
    >
      {/* Image or placeholder */}
      <div className="aspect-[4/3] w-full overflow-hidden bg-neutral-100 dark:bg-neutral-700">
        {image_url ? (
          <img
            src={image_url}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-neutral-300 dark:text-neutral-600">
            {/* Placeholder fork-knife icon */}
            <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        {/* Title */}
        <h3 className="line-clamp-2 text-sm font-semibold text-neutral-900 group-hover:text-primary-700 dark:text-white dark:group-hover:text-primary-400">
          {title}
        </h3>

        {/* Meta row — cuisine + time */}
        <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
          {cuisine && (
            <>
              <span>{cuisine}</span>
              {totalTime > 0 && <span aria-hidden="true">·</span>}
            </>
          )}
          {totalTime > 0 && (
            <span>
              {totalTime} min
            </span>
          )}
        </div>

        {/* Tags */}
        {visibleTags.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-1 pt-1">
            {visibleTags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary-700 dark:bg-primary-900/40 dark:text-primary-300"
              >
                {tag}
              </span>
            ))}
            {extraTags > 0 && (
              <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-500 dark:bg-neutral-700 dark:text-neutral-400">
                +{extraTags}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  )
}
