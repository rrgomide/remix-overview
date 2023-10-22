import type { MetaFunction } from '@remix-run/node'

export const meta: MetaFunction = () => {
  return [
    { title: 'Remix Demo' },
    { name: 'description', content: 'Remix Demo' },
  ]
}

export default function Index() {
  return <p>Remix is awesome!</p>
}
