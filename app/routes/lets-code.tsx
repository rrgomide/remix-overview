import * as React from 'react'
import { Subtitle } from '~/components'
import { SpinnerMessage } from '~/components/SpinnerMessage'
import { cn, getNewUuid } from '~/utils'

const backendBaseUrl = 'http://localhost:3003'

type FlashCard = {
  id: string
  question: string
  answer: string
  learned: boolean
  createdAt: string
  updatedAt: string
}

type Mode = 'new' | 'edit'

type FlashCardWithoutId = Omit<FlashCard, 'id'>
type FlashCardEdit = Omit<FlashCard, 'learned' | 'createdAt'>

function useFlashCards() {
  const [flashCards, setFlashCards] = React.useState<FlashCard[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [mode, setMode] = React.useState<'new' | 'edit'>('new')

  React.useEffect(() => {
    setLoading(true)

    fetch(`${backendBaseUrl}/flash-cards`)
      .then(resource => resource.json())
      .then(jsonFlashCards => {
        setFlashCards(
          jsonFlashCards.sort((a: FlashCard, b: FlashCard) =>
            a.createdAt.localeCompare(b.createdAt)
          )
        )
        setLoading(false)
      })
      .catch(error => {
        setError((error as Error).message)
        setLoading(false)
      })
  }, [])

  const add = React.useCallback(
    (newFlashCard: FlashCardWithoutId) => {
      const fullNewFlashCard: FlashCard = { ...newFlashCard, id: getNewUuid() }

      fetch(`${backendBaseUrl}/flash-cards`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fullNewFlashCard),
      })
        .then(() => {
          setFlashCards([...flashCards, fullNewFlashCard])
        })
        .catch(error => {
          setError((error as Error).message)
        })
    },
    [flashCards]
  )

  const remove = React.useCallback(
    (flashCardId: string) => {
      fetch(`${backendBaseUrl}/flash-cards/${flashCardId}`, {
        method: 'DELETE',
      })
        .then(() => {
          setFlashCards(
            flashCards.filter(flashCard => flashCard.id !== flashCardId)
          )
        })
        .catch(error => {
          setError((error as Error).message)
        })
    },
    [flashCards]
  )

  const update = React.useCallback(
    (updatedFlashCard: FlashCardEdit) => {
      fetch(`${backendBaseUrl}/flash-cards/${updatedFlashCard.id}`, {
        method: 'PUT',
        body: JSON.stringify(updatedFlashCard),
      })
        .then(resource => resource.json())
        .then(() => {
          setFlashCards(
            flashCards.map(currentFlashCard =>
              currentFlashCard.id === updatedFlashCard.id
                ? { ...currentFlashCard, ...updatedFlashCard }
                : { ...currentFlashCard }
            )
          )
        })
        .catch(error => {
          setError((error as Error).message)
        })
    },
    [flashCards]
  )

  const toggleMode = React.useCallback(
    (newMode: Mode | null) => {
      setMode(newMode ? newMode : mode === 'new' ? 'edit' : 'new')
    },
    [mode]
  )

  return {
    flashCards,
    error,
    loading,
    add,
    remove,
    update,
    mode,
    toggleMode,
  }
}

function NewFlashCard({
  onNew,
}: {
  onNew: (newFlashCard: FlashCardWithoutId) => void
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

    const now = new Date().toISOString()

    onNew({
      question: inputQuestionRef.current?.value ?? '',
      answer: inputAnswerRef.current?.value ?? '',
      learned: false,
      createdAt: now,
      updatedAt: now,
    })

    if (inputQuestionRef.current && inputAnswerRef.current) {
      inputAnswerRef.current.value = ''
      inputQuestionRef.current.value = ''
      inputQuestionRef.current.focus()
    }
  }

  return (
    <form
      className={cn(
        'flex flex-row items-center justify-between space-x-2',
        'p-1 py-2 hover:bg-gray-100'
      )}
      onSubmit={handleNew}
    >
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

      <div className="w-24">
        <button
          type="submit"
          className="w-24 h-8 bg-gray-200 rounded-md px-4 text-sm hover:bg-gray-300"
          aria-label="Add"
        >
          ➕
        </button>
      </div>
    </form>
  )
}

function FlashCard({
  children: flashCard,
  onRemove,
  onSave,
}: {
  children: FlashCard
  onRemove: (id: string) => void
  onSave: (editFields: FlashCardEdit) => void
}) {
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

  function handleEdit() {
    if (editMode) {
      handleSave()
    }

    setIsVisible(false)
    setEditMode(!editMode)
  }

  function handleSave() {
    const cannotSave =
      !inputQuestionRef.current ||
      !inputAnswerRef.current ||
      !editMode ||
      inputQuestionRef.current.value === '' ||
      inputAnswerRef.current.value === '' ||
      (inputQuestionRef.current.value === flashCard.question &&
        inputAnswerRef.current.value === flashCard.answer)

    if (cannotSave) {
      console.warn('Unable to edit flash card')
      return
    }

    onSave({
      id: flashCard.id,
      question: inputQuestionRef.current?.value ?? '',
      answer: inputAnswerRef.current?.value ?? '',
      updatedAt: new Date().toISOString(),
    })
  }

  function handleRemove() {
    onRemove(flashCard.id)
  }

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

        <form className="w-24">
          <div className="w-24 flex flex-row items-center justify-between space-x-2">
            <button
              type="button"
              className={cn(editMode ? 'opacity-0' : '')}
              aria-label={editMode ? '' : isVisible ? 'Hide' : 'Show'}
              onClick={handleToggleVisible}
            >
              {isVisible ? '🫣' : '👀'}
            </button>

            <button
              type="button"
              className="cursor-pointer"
              aria-label={editMode ? 'Save' : 'Edit'}
              onClick={handleEdit}
            >
              {editMode ? '💾' : '📑'}
            </button>

            <button
              type="button"
              className="cursor-pointer"
              aria-label="Remove"
              onClick={handleRemove}
            >
              🗑️
            </button>
          </div>
        </form>
      </span>
    </div>
  )
}

export default function LetsCodeRoute() {
  //TODO: make this a real Remix Route with loader/action
  const { flashCards, loading, error, add, update, remove } = useFlashCards()

  if (loading) {
    return (
      <div className="text-center m-4">
        <SpinnerMessage showSpinner={loading}>Loading...</SpinnerMessage>
      </div>
    )
  }

  if (error) {
    return <p className="text-red-700 font-semibold">{error}</p>
  }

  return (
    <div className="w-[62rem]">
      <Subtitle className="text-xl m-4">Flash Cards</Subtitle>

      <ul>
        {flashCards.map(flashCard => {
          return (
            <li key={flashCard.id} className="py-2 hover:bg-gray-100">
              <FlashCard
                onRemove={id => remove(id)}
                onSave={newFlashCardValues => {
                  update(newFlashCardValues)
                }}
              >
                {flashCard}
              </FlashCard>
            </li>
          )
        })}
      </ul>

      <NewFlashCard
        onNew={newFlashCard => {
          add(newFlashCard)
        }}
      />
    </div>
  )
}
