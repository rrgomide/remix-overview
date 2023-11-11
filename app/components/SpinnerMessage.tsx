import { cn } from '~/utils'

// Adapted from:
//https://github.com/kentcdodds/epic-stack-with-framer-motion/blob/main/app/components/spinner.tsx
export function Spinner({
  showSpinner,
  topRightCorner,
}: {
  showSpinner: boolean
  topRightCorner?: boolean
}) {
  return (
    <div
      className={cn(
        topRightCorner ? `absolute right-0 top-[6px] transition-opacity` : '',
        showSpinner ? 'opacity-100' : 'opacity-0'
      )}
    >
      <svg
        className="-ml-1 mr-3 h-5 w-5 animate-spin"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        width="1em"
        height="1em"
      >
        <title>Loading</title>
        <circle
          className="opacity-25"
          cx={12}
          cy={12}
          r={10}
          stroke="lightblue"
          strokeWidth={4}
        />
        <path
          className="opacity-75"
          fill="lightblue"
          d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  )
}

export function SpinnerMessage({
  children: message,
  showSpinner,
  containerClassName,
  messageClassName,
}: {
  children: string
  showSpinner: boolean
  containerClassName?: string
  messageClassName?: string
}) {
  return (
    <div
      className={cn(
        'flex flex-row items-center justify-start space-x-1 text-md',
        containerClassName ?? ''
      )}
    >
      <Spinner showSpinner={showSpinner} />
      <span className={cn('text-xl font-semibold', messageClassName)}>
        {message}
      </span>
    </div>
  )
}
