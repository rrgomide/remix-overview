import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import React from 'react'

const inspirations = [
  {
    name: 'Ryan Florence',
    twitter: 'https://twitter.com/ryanflorence',
  },
  {
    name: 'Michael Jackson',
    twitter: 'https://twitter.com/mjackson',
  },
  {
    name: 'Kent C. Dodds',
    twitter: 'https://twitter.com/kentcdodds',
  },
  {
    name: 'Jacob Paris',
    twitter: 'https://twitter.com/jacobmparis',
  },
  {
    name: 'Sam Selikoff',
    twitter: 'https://twitter.com/samselikoff',
  },
  {
    name: 'Artem Zakharchenko',
    twitter: 'https://twitter.com/kettanaito',
  },
  {
    name: 'Sergio Xalambrí',
    twitter: 'https://twitter.com/sergiodxa',
  },
  {
    name: 'Alem Tuzlac',
    twitter: 'https://twitter.com/AlemTuzlak59192',
  },
  {
    name: 'Fabio Vedovelli',
    twitter: '',
  },
  {
    name: 'Gustavo Guichard',
    twitter: 'https://twitter.com/gugaguichard',
  },
].sort((a, b) => a.name.localeCompare(b.name))

export function loader() {
  return json({ inspirations })
}

export default function ThanksRoute() {
  const { inspirations } = useLoaderData<typeof loader>()

  return (
    <div>
      <h2 className="text-center font-semibold text-xl">
        These people inspire me on keep learning Remix!
      </h2>

      <ul className="mt-8 flex flex-col space-y-2">
        {inspirations.map(({ name, twitter }) => (
          <li key={name} className="hover:text-blue-600">
            {twitter ? <a href={twitter}>{name}</a> : name}
          </li>
        ))}
      </ul>
    </div>
  )
}
