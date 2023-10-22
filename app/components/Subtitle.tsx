import { cn } from '~/utils'

export function Subtitle({
  children,
  classNames,
}: {
  children: string
  classNames?: string
}) {
  return (
    <h2 className={cn('m-4 text-center font-semibold text-2xl', classNames)}>
      {children}
    </h2>
  )
}
