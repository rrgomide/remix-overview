import { cssBundleHref } from '@remix-run/css-bundle'
import stylesheet from '~/tailwind.css'
import type { LinksFunction } from '@remix-run/node'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react'
import { Navbar } from './components'

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: 'stylesheet', href: cssBundleHref }] : []),
  { rel: 'stylesheet', href: stylesheet },
]

export default function App() {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css"></link>
        <Links />
      </head>
      <body className="h-full overflow-y-scroll">
        <ScrollRestoration />
        <Scripts />
        <LiveReload />

        <Navbar>
          <div className="p-2">
            <Outlet />
          </div>
        </Navbar>
      </body>
    </html>
  )
}
