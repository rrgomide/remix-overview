import type { MetaFunction } from '@remix-run/node'
import { DescriptionList, Subtitle } from '~/components'
import { BorderedContainer } from '~/components/BorderedContainer'

export const meta: MetaFunction = () => {
  return [
    { title: 'Remix Demo' },
    { name: 'description', content: 'Remix Demo' },
  ]
}

export default function Index() {
  return (
    <>
      <Subtitle className="mb-4">Intro</Subtitle>

      <BorderedContainer>
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
                "The best of both worlds: SSR and SPA. If users don't have JavaScript enabled somehow, they can still get some experience.",
            },
          ]}
        />
      </BorderedContainer>
    </>
  )
}
