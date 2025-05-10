import { LOG_PREFIX } from '../../config/constants'

/**
 * logger — structured, level-aware console wrapper.
 *
 * In development (import.meta.env.DEV === true) all four levels emit.
 * In production only warn and error emit, keeping the console clean for
 * real users while preserving critical signal.
 *
 * Usage:
 *   logger.debug('Query timing', { operation: 'fetchRecipes', durationMs: 42 })
 *   logger.info('User signed in', { userId })
 *   logger.warn('Slow query detected', { durationMs })
 *   logger.error('Unhandled error', { error, context })
 */

const PREFIX = LOG_PREFIX

function isDev() {
  return import.meta.env.DEV === true
}

/* eslint-disable no-console */
export const logger = {
  /**
   * Low-level diagnostic output. Silenced in production.
   * @param {string} message
   * @param {object} [context]
   */
  debug(message, context) {
    if (isDev()) {
      if (context !== undefined) {
        console.debug(PREFIX, message, context)
      } else {
        console.debug(PREFIX, message)
      }
    }
  },

  /**
   * General informational output. Silenced in production.
   * @param {string} message
   * @param {object} [context]
   */
  info(message, context) {
    if (isDev()) {
      if (context !== undefined) {
        console.info(PREFIX, message, context)
      } else {
        console.info(PREFIX, message)
      }
    }
  },

  /**
   * Non-fatal warnings. Emits in all environments.
   * @param {string} message
   * @param {object} [context]
   */
  warn(message, context) {
    if (context !== undefined) {
      console.warn(PREFIX, message, context)
    } else {
      console.warn(PREFIX, message)
    }
  },

  /**
   * Error-level output. Emits in all environments.
   * @param {string} message
   * @param {object} [context]
   */
  error(message, context) {
    if (context !== undefined) {
      console.error(PREFIX, message, context)
    } else {
      console.error(PREFIX, message)
    }
  },
}
/* eslint-enable no-console */
