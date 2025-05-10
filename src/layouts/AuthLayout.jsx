import { useEffect, useRef, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

/**
 * AuthLayout — page chrome for unauthenticated routes (login, register).
 *
 * Full-viewport-height flex container that centres a card horizontally
 * and vertically. The card has a max-width suitable for a compact form.
 *
 * Usage: wrap /login and /register routes with this layout in the router.
 */
export default function AuthLayout() {
  const location = useLocation()
  const [isTransitioning, setIsTransitioning] = useState(false)
  const previousPath = useRef(location.pathname)
  const isRegisterPage = location.pathname.includes('/register')
  const transitionTitle = isRegisterPage ? 'Create an account' : 'Sign in'


  useEffect(() => {
    // Don't animate on the initial page load.
    if (previousPath.current === location.pathname) {
      return
    }

    previousPath.current = location.pathname
    setIsTransitioning(true)

    // Matches the timing style of the reference animation:
    // the backdrop expands first, then settles back down.
    const timer = setTimeout(() => {
      setIsTransitioning(false)
    }, 900)

    return () => clearTimeout(timer)
  }, [location.pathname])

  return (
    <div className="flex min-h-screen items-center justify-center bg-login-bg bg-cover bg-center bg-no-repeat">
      <div className="w-full max-w-md">
        {/* App name / logo mark */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Mise en Place
          </h1>

          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Everything in its place
          </p>
        </div>

        {/* Animated card */}
        <motion.div
          layout
          className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-6 shadow-lg backdrop-blur-md"
          transition={{
            layout: {
              type: 'spring',
              stiffness: 1800,
              damping: 24,
            },
          }}
        >
          {/* 
            Animated backdrop.

            This is the part inspired by the GitHub example.
            It starts as a large oval and dramatically expands
            over the card during Login <-> Register transitions.
          */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute z-0 bg-primary-900"
            initial={false}
            animate={
              isTransitioning
                ? {
                    width: '235%',
                    height: '1050px',
                    borderRadius: '20%',
                    rotate: 60,
                    top: '-290px',
                    left: '-70px',
                  }
                : {
                    width: '32%',
                    height: '500px',
                    borderRadius: '50%',
                    rotate: 60,
                    top: '-297px',
                    left: '-70px',
                  }
            }
            transition={{
              type: 'spring',
              duration: 1.8,
              stiffness: 35,
            }}
          />

         {/* 
            Temporary transition heading. Only exists during the animation.*/}
          {isTransitioning && (
            <motion.h2
              key={transitionTitle}
              className="pointer-events-none absolute z-20 text-2xl font-bold text-neutral-400"
              initial={{
                opacity: 0,
                x: -20,
                y: 10,
                scale: 0.9,
              }}
              animate={{
                opacity: 1,
                x: 120,
                y: 200,
                scale: 1.08,
              }}
              exit={{
                opacity: 1,
                x: 15,
                scale: 1,
              }}
              transition={{
                type: 'spring',
                stiffness: 180,
                damping: 16,
              }}
              style={{
                top: '28px',
                left: '24px',
              }}
            >
              {transitionTitle}
            </motion.h2>
          )}

          {/* Form stays above the animated backdrop */}
          <motion.div
            className="relative z-10"
            initial={false}
            animate={{
              opacity: 1,
              scale: isTransitioning ? 0.02 : 1,
            }}
            transition={{
              duration: 0.25,
              ease: 'easeOut',
            }}
          >
            <Outlet />
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}