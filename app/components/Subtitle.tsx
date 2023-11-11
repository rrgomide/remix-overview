import React from 'react'
import { cn } from '~/utils'

export function Subtitle({
  children,
  className,
}: {
  children: string | React.ReactNode
  className?: string
}) {
  return (
    <h2 className={cn('text-center font-semibold text-2xl', className)}>
      {children}
    </h2>
  )
}
