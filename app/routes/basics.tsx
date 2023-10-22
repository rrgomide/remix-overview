import * as React from 'react'
import { Subtitle } from '~/components'
import { BorderedContainer } from '~/components/BorderedContainer'
import { getNewUuid } from '~/utils'

type FlashCard = {
  id: string
  question: string
  answer: string
}

type FlashCardWithoutId = Omit<FlashCard, 'id'>

function useFlashCards() {
  const [flashCards, setFlashCards] = React.useState<FlashCard[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    setLoading(true)

    fetch('http://localhost:3003/flash-cards')
      .then(resource => resource.json())
      .then(json => {
        setFlashCards(json)
        setLoading(false)
      })
  }, [])

  const add = React.useCallback(
    (newFlashCard: FlashCardWithoutId) => {
      const fullNewFlashCard: FlashCard = { ...newFlashCard, id: getNewUuid() }
      setFlashCards([...flashCards, fullNewFlashCard])

      fetch('http://localhost:3003/flash-cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fullNewFlashCard),
      })
    },
    [flashCards]
  )

  const remove = React.useCallback(
    (flashCard: FlashCard) => {
      setFlashCards([...flashCards, flashCard])
    },
    [flashCards]
  )

  const update = React.useCallback(
    (flashCard: FlashCard) => {
      setFlashCards([...flashCards, flashCard])
    },
    [flashCards]
  )

  return {
    flashCards,
    loading,
    add,
    remove,
    update,
  }
}

function FlashCardContainer({ children }: { children: React.ReactNode }) {
  return <div className="w-[800px]">{children}</div>
}

function FlashCards({
  children: flashCards,
  loading,
  onNew,
  onRemove,
  onUpdate,
}: {
  children: FlashCard[]
  loading: boolean
  onNew: (newFlashCard: FlashCardWithoutId) => void
  onRemove: (flashCard: FlashCard) => void
  onUpdate: (flashCard: FlashCard) => void
}) {
  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <ul>
      {flashCards.map(flashCard => {
        return (
          <li key={flashCard.id} className="py-2 hover:bg-gray-100">
            <FlashCard>{flashCard}</FlashCard>
          </li>
        )
      })}
    </ul>
  )
}

function FlashCard({ children: flashCard }: { children: FlashCard }) {
  const [isVisible, setIsVisible] = React.useState(false)

  function toggleVisible() {
    setIsVisible(!isVisible)
  }

  return (
    <div className="w-full flex flex-row items-center justify-between">
      <span>{flashCard.question}</span>

      <div className="flex flex-row items-center justify-end space-x-2">
        <span className="cursor-pointer" onClick={toggleVisible}>
          {isVisible ? flashCard.answer : '👁️'}
        </span>

        <span className="cursor-pointer" onClick={toggleVisible}>
          🗑️
        </span>
      </div>
    </div>
  )
}

//TODO: make this a real Remix Route with loader/action
export default function BasicsRoute() {
  const { flashCards, add, remove, update, loading } = useFlashCards()

  return (
    <>
      <Subtitle>Basics</Subtitle>

      <BorderedContainer>
        <Subtitle classNames="text-xl">Flash Cards</Subtitle>

        <FlashCardContainer>
          <FlashCards
            loading={loading}
            onNew={add}
            onRemove={remove}
            onUpdate={update}
          >
            {flashCards}
          </FlashCards>
        </FlashCardContainer>
      </BorderedContainer>
    </>
  )
}
