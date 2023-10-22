import type { MetaFunction } from '@remix-run/node'
import DescriptionList from '~/components/DescriptionList'

export const meta: MetaFunction = () => {
  return [
    { title: 'Remix Demo' },
    { name: 'description', content: 'Remix Demo' },
  ]
}

export default function Index() {
  return (
    <div className="max-w-4xl flex flex-row items-center justify-center border p-4">
      <DescriptionList
        headerTitle="Remix is a modern full-stack Web Framework"
        headerDescription="It lets you focus on UI and it's really fond of web standards, so it's aimed to deliver a fast, slick, and resilient UX."
        items={[
          {
            title: 'Server Side Rendering (SSR)',
            description:
              'Initial HTML is generated on the server, so we can have faster page loads.',
          },
          {
            title: 'Robust Data Loading Mechanism',
            description:
              'Loaders (GET), Actions (POST, PUT, PATCH, DELETE), and fetchers.',
          },
          {
            title: 'File-Based Routing',
            description:
              "Route Components are organized in the project's directory structure by default.",
          },
          {
            title: 'Progressive Enhancement',
            description:
              "Think of uniting the best of both worlds: SSR and SPA. If you don't have JavaScript enabled somehow, you can still get a fast and slick experience.",
          },
        ]}
      />
    </div>
  )
}
