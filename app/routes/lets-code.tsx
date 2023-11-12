import {
  type ActionFunctionArgs,
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/node'
import {
  Form,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from '@remix-run/react'
import * as React from 'react'
import { Subtitle } from '~/components'
import { cn, customFetch } from '~/utils'

const backendBaseUrl = 'http://localhost:3003'
const addDelay = false
const addError = false

type FlashCard = {
  id: string
  question: string
  answer: string
  learned: string
  createdAt: string
  updatedAt: string
}

type FlashCardToAdd = Omit<FlashCard, 'id' | 'createdAt' | 'updatedAt'>
// type FlashCardToEdit = Omit<FlashCard, 'updatedAt'>

export const meta: MetaFunction = () => {
  return [{ title: `Let's Code!` }]
}

export async function loader(args: LoaderFunctionArgs) {
  const flashCards: FlashCard[] = await customFetch(
    `${backendBaseUrl}/flash-cards`,
    addDelay,
    false
  )
  return json({ flashCards })
}

export async function action(args: ActionFunctionArgs) {
  const formData = await args.request.formData()
  const intent = formData.get('intent')?.toString() ?? ''
  const id = formData.get('id')?.toString() ?? ''

  switch (intent) {
    case 'delete': {
      await customFetch(
        `${backendBaseUrl}/flash-cards/${id}`,
        addDelay,
        addError,
        {
          method: 'DELETE',
        }
      )
      return json({ ok: true, error: null })
    }

    case 'toggle-learn': {
      const currentLearned = formData.get('learned')?.toString() ?? ''

      await customFetch(
        `${backendBaseUrl}/flash-cards/${id}`,
        addDelay,
        addError,
        {
          method: 'PATCH',
          body: JSON.stringify({
            learned: currentLearned === 'true' ? 'false' : 'true',
            updatedAt: new Date().toISOString(),
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      return json({ ok: true, error: null })
    }

    case 'update-qa': {
      const newQuestion = formData.get('input-question')?.toString() ?? ''
      const newAnswer = formData.get('input-answer')?.toString() ?? ''

      await customFetch(
        `${backendBaseUrl}/flash-cards/${id}`,
        addDelay,
        addError,
        {
          method: 'PATCH',
          body: JSON.stringify({
            question: newQuestion,
            answer: newAnswer,
            updatedAt: new Date().toISOString(),
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      return json({ ok: true, error: null })
    }
  }

  return null
}

function NewFlashCard({
  onNew,
}: {
  onNew: (newFlashCard: FlashCardToAdd) => void
}) {
  const inputQuestionRef = React.useRef<HTMLInputElement | null>(null)
  const inputAnswerRef = React.useRef<HTMLInputElement | null>(null)

  function handleNew(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const cannotAdd =
      !inputQuestionRef.current ||
      !inputAnswerRef.current ||
      inputQuestionRef.current.value.trim() === '' ||
      inputAnswerRef.current.value.trim() === ''

    if (cannotAdd) {
      console.warn('Unable to add flash card')
      return
    }

    onNew({
      question: inputQuestionRef.current?.value ?? '',
      answer: inputAnswerRef.current?.value ?? '',
      learned: 'false',
    })

    if (inputQuestionRef.current && inputAnswerRef.current) {
      inputAnswerRef.current.value = ''
      inputQuestionRef.current.value = ''
      inputQuestionRef.current.focus()
    }
  }

  return (
    <div className="p-1 py-2 border border-white">
      <form onSubmit={handleNew}>
        <div className="w-full flex flex-row items-center justify-between space-x-2 select-none">
          <input
            autoFocus
            ref={inputQuestionRef}
            className="w-full border p-1"
            type="text"
            placeholder="Question"
            defaultValue={''}
          />

          <input
            ref={inputAnswerRef}
            className="w-full border p-1"
            type="text"
            placeholder="Answer"
            defaultValue=""
          />

          <div className="w-32 flex flex-row items-center justify-start space-x-2">
            <button
              type="submit"
              className="w-32 h-8 bg-gray-200 rounded-md px-4 text-sm hover:bg-gray-300"
              aria-label="Add"
            >
              ➕
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

function FlashCard({ children: flashCard }: { children: FlashCard }) {
  const [isVisible, setIsVisible] = React.useState(false)
  const [editMode, setEditMode] = React.useState(false)
  const [localQuestion, setLocalQuestion] = React.useState(flashCard.question)
  const [localAnswer, setLocalAnswer] = React.useState(flashCard.answer)
  const inputQuestionRef = React.useRef<HTMLInputElement | null>(null)

  React.useEffect(() => {
    if (editMode) {
      inputQuestionRef.current?.select()
    }
  }, [editMode])

  function handleToggleVisible() {
    setIsVisible(!isVisible)
  }

  function handleEdit() {
    setIsVisible(true)
    setEditMode(!editMode)
  }

  return (
    <div className={cn('p-1 py-2 border border-white hover:border-blue-300')}>
      <Form id={`qa-form-${flashCard.id}`} method="POST">
        <div className="w-full flex flex-row items-center justify-between space-x-2 select-none">
          <input
            ref={inputQuestionRef}
            name="input-question"
            className={cn(
              'w-full p-1 border border-white',
              editMode ? 'border-gray-200' : 'pointer-events-none'
            )}
            type="text"
            value={localQuestion}
            onChange={e => setLocalQuestion(e.currentTarget.value)}
            readOnly={editMode ? false : isVisible ? true : false}
          />

          <input
            name="input-answer"
            className={cn(
              'w-full p-1 border border-white',
              editMode ? 'border-gray-200' : 'pointer-events-none'
            )}
            type="text"
            value={isVisible ? localAnswer : ''}
            onChange={e => setLocalAnswer(e.currentTarget.value)}
            readOnly={editMode ? false : isVisible ? true : false}
          />

          <div className="flex flex-row items-center justify-start gap-[0.825rem]">
            <button
              type="button"
              aria-label={editMode ? '' : isVisible ? 'Hide' : 'Show'}
              onClick={handleToggleVisible}
            >
              {isVisible ? '🫣' : '👀'}
            </button>

            <button
              type="submit"
              name="intent"
              value="update-qa"
              aria-label={editMode ? 'Save' : 'Edit'}
              onClick={handleEdit}
            >
              {editMode ? '💾' : '📑'}
            </button>

            <button
              type="submit"
              name="intent"
              value="toggle-learn"
              aria-label={
                flashCard.learned === 'true'
                  ? 'Mark as Unlearned'
                  : 'Mark as Learned'
              }
            >
              {flashCard.learned === 'true' ? '🟢' : '🟠'}
            </button>

            <button
              type="submit"
              name="intent"
              value="delete"
              aria-label="Remove"
            >
              🗑️
            </button>

            <input type="hidden" name="id" value={flashCard.id} />
            <input type="hidden" name="learned" value={flashCard.learned} />
          </div>
        </div>
      </Form>
    </div>
  )
}

export default function LetsCodeRoute() {
  const { flashCards } = useLoaderData<typeof loader>()

  const totalLearned = flashCards.filter(
    flashCard => flashCard.learned === 'true'
  ).length

  return (
    <div className="w-[62rem]">
      <Subtitle className="text-xl m-4">
        {flashCards.length} Flash Cards | {totalLearned} Learned
      </Subtitle>

      <ul>
        {flashCards.map(flashCard => {
          return (
            <li key={flashCard.id}>
              <FlashCard>{flashCard}</FlashCard>
            </li>
          )
        })}
      </ul>

      <NewFlashCard
        onNew={newFlashCard => {
          // doAdd(newFlashCard)
        }}
      />
    </div>
  )
}

export function ErrorBoundary() {
  const routeError = useRouteError()

  if (isRouteErrorResponse(routeError)) {
    return (
      <p className="text-red-700 font-semibold">
        {routeError.status} ({routeError.statusText}): {routeError.data}
      </p>
    )
  }

  return <pre>{JSON.stringify(routeError, null, 2)}</pre>
}
