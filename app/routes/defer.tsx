import { defer, json } from '@remix-run/node'
import { Await, useLoaderData } from '@remix-run/react'
import React from 'react'
import { Spinner } from '~/components/SpinnerMessage'

const delay = (miliseconds?: number) =>
  new Promise(resolve => setTimeout(resolve, miliseconds ?? 2_000))

async function getBankInfo() {
  await delay()
  return {
    name: 'Payoneer',
    balance: 2_000,
  }
}

async function getHealthExams() {
  await delay()
  return {
    name: 'Blood Type',
    result: 'A+',
  }
}

async function getWishList() {
  await delay(100)
  return {
    name: 'M3 Pro',
    price: 3_099,
  }
}

function Json({ children: data, title }: { children: any; title?: string }) {
  return (
    <div className="shadow-md p-2 h-56 w-56 flex flex-col items-center justify-center space-y-4">
      <h2 className="text-center font-semibold text-lg">{title}</h2>

      <pre>
        <code>{JSON.stringify(data, null, 2)}</code>
      </pre>
    </div>
  )
}

export async function loader() {
  const bankInfoPromise = getBankInfo()
  const healthExamsPromise = getHealthExams()
  const wishList = await getWishList()

  return defer({ bankInfoPromise, healthExamsPromise, wishList })
}
export default function DeferRoute() {
  const { bankInfoPromise, healthExamsPromise, wishList } =
    useLoaderData<typeof loader>()

  return (
    <div>
      <h2 className="text-center font-semibold text-lg">Life App</h2>
      <div className="flex flex-row items-center justify-center flex-wrap gap-4">
        <React.Suspense
          fallback={
            <Json title="Bank Info">
              <Spinner showSpinner={true} />
            </Json>
          }
        >
          <Await resolve={bankInfoPromise}>
            {bankInfo => <Json title="Bank Info">{bankInfo}</Json>}
          </Await>
        </React.Suspense>

        <React.Suspense
          fallback={
            <Json title="Bank Info">
              <Spinner showSpinner={true} />
            </Json>
          }
        >
          <Await resolve={healthExamsPromise}>
            {healthExams => <Json title="Bank Info">{healthExams}</Json>}
          </Await>
        </React.Suspense>

        <Json title="Wish List">{wishList}</Json>
      </div>
    </div>
  )
}
