import { Disclosure } from '@headlessui/react'
import { useLocation } from '@remix-run/react'
import { cn } from '~/utils'

const navigation = [
  {
    name: 'Intro',
    href: '/',
  },
  {
    name: "Let's Code",
    href: '/lets-code',
  },
  {
    name: 'Thanks!',
    href: '/thanks',
  },
]

//TODO 1 - Improve Navigation
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function RemixNavigationItem() {
  return null
}

function NavigationItem({
  href,
  isCurrentRoute,
  children,
}: {
  href: string
  isCurrentRoute: boolean
  children: string
}) {
  return (
    <a
      href={href}
      className={cn(
        'h-16 inline-flex items-center',
        'border-b-2 px-1 pt-1 text-sm font-medium',
        isCurrentRoute
          ? 'border-indigo-500 text-gray-900'
          : 'border-transparent text-gray-500, hover:border-gray-300 hover:text-gray-700'
      )}
    >
      {children}
    </a>
  )
}

export function Navbar({ children }: { children: React.ReactNode }) {
  const { pathname: currentPathname } = useLocation()

  return (
    <div className="min-h-full">
      <Disclosure as="nav" className="bg-white">
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <div className="flex flex-shrink-0 items-center">
                  <img
                    className="block h-8 w-auto rounded-full"
                    src="/remix-logo.png"
                    alt="Remix"
                  />
                </div>

                <div className="flex flex-row items-center justify-start space-x-8 ml-6">
                  {navigation.map(item => {
                    return (
                      <NavigationItem
                        key={item.name}
                        href={item.href}
                        isCurrentRoute={item.href === currentPathname}
                      >
                        {item.name}
                      </NavigationItem>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </>
      </Disclosure>

      {children}
    </div>
  )
}
