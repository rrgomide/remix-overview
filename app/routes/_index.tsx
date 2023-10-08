import type { MetaFunction } from '@remix-run/node'

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ]
}

function MainTitle() {
  return (
    <h1 className="text-red-900 font-semibold text-center text-4xl">
      Remix Overview
    </h1>
  )
}

export default function Index() {
  return (
    <div className="p-2">
      <MainTitle />
    </div>
  )
}
