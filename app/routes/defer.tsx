import { type LoaderFunctionArgs, json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'

const bigDelay = () => new Promise(resolve => setTimeout(resolve, 2_000))

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

export async function loader(args: LoaderFunctionArgs) {
  const bankInfo = await (async () => {
    await bigDelay()
    return {
      name: 'Payoneer',
      balance: 2_000,
    }
  })()

  const healthExams = await (async () => {
    await bigDelay()
    return {
      name: 'Blood Type',
      result: 'A+',
    }
  })()

  const wishList = await (async () => {
    await bigDelay()
    return {
      name: 'M3 Pro',
      price: '3_099',
    }
  })()

  return json({ bankInfo, healthExams, wishList })
}
export default function DeferRoute() {
  const { bankInfo, healthExams, wishList } = useLoaderData<typeof loader>()

  return (
    <div>
      <h2 className="text-center font-semibold text-lg">Life App</h2>
      <div className="flex flex-row items-center justify-center flex-wrap gap-4">
        <Json title="Bank Info">{bankInfo}</Json>
        <Json title="Health Exams">{healthExams}</Json>
        <Json title="Wish List">{wishList}</Json>
      </div>
    </div>
  )
}
