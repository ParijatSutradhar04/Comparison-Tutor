import { useState } from 'react'
import { QuestionItem, ChosenSide } from '../hooks/useAdaptiveEngine'

interface WordPairProps {
  question: QuestionItem
  onAnswer: (side: ChosenSide) => void
}

export default function WordPair({ question, onAnswer }: WordPairProps) {
  const [selectedSide, setSelectedSide] = useState<ChosenSide | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)

  const correctSide: ChosenSide = question.left.sizeValue > question.right.sizeValue ? 'left' : 'right'

  // Debug logging
  console.log('WordPair question:', {
    id: question.id,
    leftWord: question.left.word,
    leftLabel: question.left.label,
    rightWord: question.right.word,
    rightLabel: question.right.label
  })

  const handleClick = (side: ChosenSide) => {
    if (selectedSide) return // Already answered

    setSelectedSide(side)
    setShowFeedback(true)

    setTimeout(() => {
      onAnswer(side)
      setSelectedSide(null)
      setShowFeedback(false)
    }, 1500)
  }

  const getButtonClass = (side: ChosenSide) => {
    let baseClass = 'btn-choice min-h-[150px] flex flex-col items-center justify-center space-y-3'
    
    if (showFeedback && selectedSide) {
      if (side === correctSide) {
        baseClass += ' correct'
      } else if (side === selectedSide) {
        baseClass += ' incorrect'
      }
    }
    
    return baseClass
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Left Side */}
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Left</h3>
        <button
          onClick={() => handleClick('left')}
          className={getButtonClass('left')}
          disabled={selectedSide !== null}
        >
          <div className="text-2xl font-bold capitalize text-blue-600">
            {question.left.word || question.left.label || 'Missing Word'}
          </div>
          <div className="text-sm text-gray-600">
            ({question.left.size})
          </div>
        </button>
      </div>

      {/* Right Side */}
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Right</h3>
        <button
          onClick={() => handleClick('right')}
          className={getButtonClass('right')}
          disabled={selectedSide !== null}
        >
          <div className="text-2xl font-bold capitalize text-blue-600">
            {question.right.word || question.right.label || 'Missing Word'}
          </div>
          <div className="text-sm text-gray-600">
            ({question.right.size})
          </div>
        </button>
      </div>
    </div>
  )
}
