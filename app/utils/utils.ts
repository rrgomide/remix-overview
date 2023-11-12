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

export async function randomDelay() {
  const delay = Math.random() * 2000
  return new Promise(resolve => setTimeout(resolve, delay))
}

export async function customFetch(
  url: string,
  maybeDelay = false,
  maybeError = false,
  options?: RequestInit | null
): Promise<any> {
  if (maybeDelay) {
    await randomDelay()
  }

  try {
    if (maybeError) {
      const random = Math.random()
      if (random > 0.15) {
        throw new Error('Random error')
      }
    }

    const response = await fetch(url, options ?? {})
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error:', (error as Error).message)
    throw error
  }
}
