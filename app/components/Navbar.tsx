import { Disclosure } from '@headlessui/react'
import { NavLink, useNavigation } from '@remix-run/react'
import { cn } from '~/utils'
import { Spinner } from './SpinnerMessage'

const routes = [
  {
    name: 'Intro',
    href: '/',
  },
  {
    name: 'CRUD',
    href: '/crud',
  },
  {
    name: 'Defer',
    href: '/defer',
  },
  {
    name: 'Thanks!',
    href: '/thanks',
  },
]

export function Navbar() {
  const navigation = useNavigation()
  const isChangingUrl = navigation.state !== 'idle'

  return (
    <>
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

                {routes.map(routeItem => {
                  const isDestinationRoute = routeItem.href.includes(
                    navigation?.location?.pathname ?? ''
                  )

                  return (
                    <div
                      key={routeItem.name}
                      className="flex flex-row items-center justify-start space-x-1 ml-6"
                    >
                      <Spinner
                        showSpinner={isChangingUrl && isDestinationRoute}
                        topRightCorner={false}
                        svgClassName="mr-1"
                      />

                      <NavLink
                        to={routeItem.href}
                        className={({ isActive }) =>
                          cn(
                            'h-16 inline-flex items-center',
                            'border-b-2 px-1 pt-1 text-sm font-medium',
                            isActive
                              ? 'border-indigo-500 text-gray-900'
                              : 'border-transparent text-gray-500, hover:border-gray-300 hover:text-gray-700'
                          )
                        }
                      >
                        {routeItem.name}
                      </NavLink>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </>
      </Disclosure>
    </>
  )
}
