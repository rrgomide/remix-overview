import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { GithubIcon } from '~/components/GithubIcon'
import { cn } from '~/utils'

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
  {
    name: 'Daniel Weinmann',
    twitter: 'https://twitter.com/danielweinmann',
  },
  {
    name: 'Brooks Lybrand',
    twitter: 'https://twitter.com/BrooksLybrand',
  },
  {
    name: 'Daniel Kanem',
    twitter: 'https://twitter.com/DanielKanem',
  },
  {
    name: 'Andre Landgraf',
    twitter: 'https://twitter.com/AndreLandgraf94',
  },
  {
    name: 'Michael Carter',
    twitter: 'https://twitter.com/kiliman',
  },
].sort((a, b) => a.name.localeCompare(b.name))

export function loader() {
  return json({ inspirations })
}

export default function ThanksRoute() {
  const { inspirations } = useLoaderData<typeof loader>()

  return (
    <div className="w-full flex flex-row items-start justify-center mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center justify-center">
        <div
          aria-label="Github Repository"
          className="flex flex-row items-center justify-start space-x-2 hover:text-sky-600"
        >
          <GithubIcon />
          <a
            href="https://github.com/rrgomide/remix-overview"
            target="_blank"
            rel="noreferrer"
            className={cn('text-lg')}
          >
            https://github.com/rrgomide/remix-overview
          </a>
        </div>

        <div>
          <a
            href="https://www.linkedin.com/in/rrgomide/?locale=en_US"
            target="_blank"
            rel="noreferrer"
          >
            <img
              src="linkedin.jpeg"
              alt="LinkedIn Profile"
              aria-label="LinkedIn Profile"
              className="w-96 h-96 rounded-md mt-12"
            />
          </a>
        </div>
      </div>

      <div className="flex flex-col items-start justify-start ml-12 pl-8 border-l">
        <h2 className="text-center font-semibold text-xl">Inspirations</h2>

        <ul className="mt-8 flex flex-col space-y-2">
          {inspirations.map(({ name, twitter }) => (
            <li key={name} className="hover:text-sky-600">
              {twitter ? (
                <a href={twitter} target="_blank" rel="noreferrer">
                  {name}
                </a>
              ) : (
                name
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
