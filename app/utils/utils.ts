import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { v4 as uuid } from 'uuid'

export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export function cn(...tailwindClassNames: ClassValue[]) {
  return twMerge(clsx(tailwindClassNames))
}

export function getNewUuid() {
  return uuid()
}
