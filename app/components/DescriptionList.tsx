import { cn } from '~/utils'

type DescriptionListItem = {
  title: string
  description: string
}

export function DescriptionList({
  headerTitle,
  headerDescription,
  items,
}: {
  headerTitle: string
  headerDescription: string
  items: DescriptionListItem[]
}) {
  return (
    <div>
      <div className="px-4 sm:px-0">
        <h3 className="text-base font-semibold leading-7 text-gray-900">
          {headerTitle}
        </h3>
        <p className="mt-1 text-sm leading-6 text-gray-500">
          {headerDescription}
        </p>
      </div>
      <div className="mt-6 border-t border-gray-100">
        <dl className="divide-y divide-gray-100">
          {items.map((item, index) => {
            const bgColor = index % 2 === 1 ? 'bg-white' : 'bg-gray-100'

            return (
              <div
                key={item.title}
                className={cn(
                  bgColor,
                  'px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3'
                )}
              >
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  {item.title}
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {item.description}
                </dd>
              </div>
            )
          })}
        </dl>
      </div>
    </div>
  )
}
