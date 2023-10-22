import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export function cn(...tailwindClassNames: ClassValue[]) {
  return twMerge(clsx(tailwindClassNames))
}
