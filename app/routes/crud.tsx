import {
  ActionFunctionArgs,
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/node'
import { Form, useLoaderData } from '@remix-run/react'
import * as React from 'react'
import { Subtitle } from '~/components'
import { SpinnerMessage } from '~/components/SpinnerMessage'
import { cn, customFetch, getNewUuid, randomDelay } from '~/utils'

export const meta: MetaFunction = () => {
  return [{ title: `CRUD` }]
}

const backendBaseUrl = 'http://localhost:3003'
const addDelay = true
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
type FlashCardToEdit = Omit<FlashCard, 'updatedAt'>

// function useFlashCards() {
//   const [flashCards, setFlashCards] = React.useState<FlashCard[]>([])
//   const [loading, setLoading] = React.useState(true)
//   const [error, setError] = React.useState<string | null>(null)

//   React.useEffect(() => {
//     setLoading(true)

//     customFetch(`${backendBaseUrl}/flash-cards`, addDelay, false)
//       .then(jsonFlashCards => {
//         setFlashCards(
//           jsonFlashCards.sort((a: FlashCard, b: FlashCard) =>
//             b.createdAt.localeCompare(a.createdAt)
//           )
//         )
//         setLoading(false)
//       })
//       .catch(error => {
//         setError((error as Error).message)
//         setLoading(false)
//       })
//   }, [])

//   const doAdd = React.useCallback(
//     (newFlashCard: FlashCardToAdd) => {
//       const now = new Date().toISOString()

//       const fullNewFlashCard: FlashCard = {
//         id: getNewUuid(),
//         ...newFlashCard,
//         createdAt: now,
//         updatedAt: now,
//       }

//       customFetch(`${backendBaseUrl}/flash-cards`, addDelay, addError, {
//         method: 'POST',
//         body: JSON.stringify(fullNewFlashCard),
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       })
//         .then(() => {
//           setFlashCards([fullNewFlashCard, ...flashCards])
//         })
//         .catch(error => {
//           setError((error as Error).message)
//         })
//     },
//     [flashCards]
//   )

//   const doUpdate = React.useCallback(
//     (updatedFlashCard: FlashCardToEdit) => {
//       const fullUpdatedFlashCard = {
//         ...updatedFlashCard,
//         updatedAt: new Date().toISOString(),
//       }

//       customFetch(
//         `${backendBaseUrl}/flash-cards/${fullUpdatedFlashCard.id}`,
//         addDelay,
//         addError,
//         {
//           method: 'PUT',
//           body: JSON.stringify(fullUpdatedFlashCard),
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         }
//       )
//         .then(() => {
//           setFlashCards(
//             flashCards.map(currentFlashCard =>
//               currentFlashCard.id === updatedFlashCard.id
//                 ? {
//                     ...currentFlashCard,
//                     ...updatedFlashCard,
//                     updatedAt: new Date().toISOString(),
//                   }
//                 : { ...currentFlashCard }
//             )
//           )
//         })
//         .catch(error => {
//           setError((error as Error).message)
//         })
//     },
//     [flashCards]
//   )

//   const doRemove = React.useCallback(
//     (flashCardId: string) => {
//       customFetch(
//         `${backendBaseUrl}/flash-cards/${flashCardId}`,
//         addDelay,
//         addError,
//         {
//           method: 'DELETE',
//         }
//       )
//         .then(async () => {
//           if (addDelay) {
//             await randomDelay()
//           }

//           setFlashCards(
//             flashCards.filter(flashCard => flashCard.id !== flashCardId)
//           )
//         })
//         .catch(error => {
//           setError((error as Error).message)
//         })
//     },
//     [flashCards]
//   )

//   return {
//     flashCards,
//     loading,
//     error,
//     doAdd,
//     doRemove,
//     doUpdate,
//   }
// }

// function NewFlashCard({
//   onNew,
// }: {
//   onNew: (newFlashCard: FlashCardToAdd) => void
// }) {
//   const inputQuestionRef = React.useRef<HTMLInputElement | null>(null)
//   const inputAnswerRef = React.useRef<HTMLInputElement | null>(null)

//   function handleNew(event: React.FormEvent<HTMLFormElement>) {
//     event.preventDefault()

//     const cannotAdd =
//       !inputQuestionRef.current ||
//       !inputAnswerRef.current ||
//       inputQuestionRef.current.value.trim() === '' ||
//       inputAnswerRef.current.value.trim() === ''

//     if (cannotAdd) {
//       console.warn('Unable to add flash card')
//       return
//     }

//     onNew({
//       question: inputQuestionRef.current?.value ?? '',
//       answer: inputAnswerRef.current?.value ?? '',
//       learned: 'false',
//     })

//     if (inputQuestionRef.current && inputAnswerRef.current) {
//       inputAnswerRef.current.value = ''
//       inputQuestionRef.current.value = ''
//       inputQuestionRef.current.focus()
//     }
//   }

//   return (
//     <form
//       className={cn(
//         'flex flex-row items-center justify-between space-x-2',
//         'p-1 py-2 hover:bg-gray-100'
//       )}
//       onSubmit={handleNew}
//     >
//       <input
//         autoFocus
//         ref={inputQuestionRef}
//         className="w-full border p-1"
//         type="text"
//         placeholder="Question"
//         defaultValue={''}
//       />

//       <input
//         ref={inputAnswerRef}
//         className="w-full border p-1"
//         type="text"
//         placeholder="Answer"
//         defaultValue=""
//       />

//       <div className="w-32">
//         <button
//           type="submit"
//           className="w-32 h-8 bg-gray-200 rounded-md px-4 text-sm hover:bg-gray-300"
//           aria-label="Add"
//         >
//           ➕
//         </button>
//       </div>
//     </form>
//   )
// }

function FlashCard({ children: flashCard }: { children: FlashCard }) {
  const [isVisible, setIsVisible] = React.useState(false)
  const [editMode, setEditMode] = React.useState(false)
  const inputQuestionRef = React.useRef<HTMLInputElement | null>(null)
  const inputAnswerRef = React.useRef<HTMLInputElement | null>(null)

  React.useEffect(() => {
    if (editMode) {
      inputQuestionRef.current?.select()
    }
  }, [editMode])

  function handleToggleVisible() {
    setIsVisible(!isVisible)
  }

  // function toggleLearn() {
  //   onSave({
  //     id: flashCard.id,
  //     question: flashCard.question,
  //     answer: flashCard.answer,
  //     learned: flashCard.learned === 'true' ? 'false' : 'true',
  //     createdAt: flashCard.createdAt,
  //   })
  // }

  function handleEdit() {
    if (editMode) {
      // handleSave()
    }

    setIsVisible(false)
    setEditMode(!editMode)
  }

  // function handleSave() {
  //   const cannotSave =
  //     !inputQuestionRef.current ||
  //     !inputAnswerRef.current ||
  //     !editMode ||
  //     inputQuestionRef.current.value === '' ||
  //     inputAnswerRef.current.value === '' ||
  //     (inputQuestionRef.current.value === flashCard.question &&
  //       inputAnswerRef.current.value === flashCard.answer)

  //   if (cannotSave) {
  //     console.warn('Unable to edit flash card')
  //     return
  //   }

  //   onSave({
  //     id: flashCard.id,
  //     question: inputQuestionRef.current?.value ?? '',
  //     answer: inputAnswerRef.current?.value ?? '',
  //     learned: flashCard.learned,
  //     createdAt: flashCard.createdAt,
  //   })
  // }

  // function handleRemove() {
  //   onRemove(flashCard.id)
  // }

  return (
    <div className="w-full flex flex-row items-center justify-between space-x-2 select-none">
      <span className="flex flex-row items-center justify-between space-x-2 w-full p-1">
        {editMode ? (
          <input
            ref={inputQuestionRef}
            className="w-full border p-1"
            type="text"
            defaultValue={flashCard.question}
          />
        ) : (
          <span className="w-full p-1">{flashCard.question}</span>
        )}

        {editMode ? (
          <input
            ref={inputAnswerRef}
            className="w-full border p-1"
            type="text"
            defaultValue={flashCard.answer}
          />
        ) : (
          <span className="w-full p-1">
            {isVisible ? flashCard.answer : ''}
          </span>
        )}

        <Form method="POST" className="w-32">
          <div className="w-32 flex flex-row items-center justify-between space-x-2">
            <button
              type="button"
              className={cn(
                editMode ? 'opacity-0 pointer-events-none cursor-none' : ''
              )}
              aria-label={editMode ? '' : isVisible ? 'Hide' : 'Show'}
              onClick={handleToggleVisible}
            >
              {isVisible ? '🫣' : '👀'}
            </button>

            <button
              type="button"
              aria-label={editMode ? 'Save' : 'Edit'}
              onClick={handleEdit}
            >
              {editMode ? '💾' : '📑'}
            </button>

            <button
              type="button"
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
          </div>
        </Form>
      </span>
    </div>
  )
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
  const { request } = args
  const formData = await request.formData()
  const intent = formData.get('intent')?.toString()
  console.log('🔥  intent:', intent)

  switch (intent) {
    case 'delete': {
      const flashCardId = formData.get('id')?.toString()

      await customFetch(
        'http://localhost:3003/flash-cards/' + flashCardId,
        addDelay,
        addError,
        { method: 'DELETE' }
      )

      break
    }
  }

  return null
}

export default function CrudRoute() {
  const { flashCards } = useLoaderData<typeof loader>()

  const learnedFlashCards = flashCards.filter(
    flashCard => flashCard.learned === 'true'
  )

  return (
    <div className="w-[62rem]">
      <Subtitle className="text-xl m-4">
        {flashCards.length} Flash Cards | {learnedFlashCards.length} Learned
      </Subtitle>

      {/* <NewFlashCard
        onNew={newFlashCard => {
          doAdd(newFlashCard)
        }}
      /> */}

      <ul>
        {flashCards.map(flashCard => {
          return (
            <li key={flashCard.id} className="py-2 hover:bg-gray-100">
              <FlashCard>{flashCard}</FlashCard>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
