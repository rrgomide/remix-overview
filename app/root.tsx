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

function NoJavaScript() {
  return (
    <div className="absolute top-0 left-0">
      <img src="/trollface.png" width={100} height={100} alt="Troll Face" />
    </div>
  )
}

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
        <noscript>
          <NoJavaScript />
        </noscript>

        <ScrollRestoration />
        <Scripts />
        <LiveReload />

        <Navbar />
        <div className="p-12 mt-4 flex flex-row items-center justify-center w-full">
          <Outlet />
        </div>
      </body>
    </html>
  )
}
