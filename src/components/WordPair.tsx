import { useState, useEffect } from 'react'
import { QuestionItem, ChosenSide } from '../hooks/useAdaptiveEngine'

interface WordPairProps {
  question: QuestionItem
  onAnswer: (side: ChosenSide) => void
}

export default function WordPair({ question, onAnswer }: WordPairProps) {
  const [selectedSide, setSelectedSide] = useState<ChosenSide | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isPortrait, setIsPortrait] = useState(false)

  // Check if screen is in portrait mode
  useEffect(() => {
    const checkOrientation = () => {
      setIsPortrait(window.innerHeight > window.innerWidth)
    }
    
    checkOrientation()
    window.addEventListener('resize', checkOrientation)
    
    return () => window.removeEventListener('resize', checkOrientation)
  }, [])

  const correctSide: ChosenSide = question.left.sizeValue > question.right.sizeValue ? 'left' : 'right'

  // Get orientation-aware labels
  const getPositionLabels = () => {
    if (isPortrait) {
      return { left: 'Top', right: 'Bottom' }
    }
    return { left: 'Left', right: 'Right' }
  }

  // Get orientation-aware button texts
  const getButtonTexts = () => {
    if (isPortrait) {
      return { left: 'Choose Top', right: 'Choose Bottom' }
    }
    return { left: 'Choose Left', right: 'Choose Right' }
  }

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
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Left/Top Side */}
        <div className="flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">{getPositionLabels().left}</h3>
          <button
            onClick={() => handleClick('left')}
            className={getButtonClass('left')}
            disabled={selectedSide !== null}
          >
            <div className="text-2xl font-bold capitalize text-blue-600">
              {question.left.word || question.left.label || 'Missing Word'}
            </div>
            
          </button>
        </div>

        {/* Right/Bottom Side */}
        <div className="flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">{getPositionLabels().right}</h3>
          <button
            onClick={() => handleClick('right')}
            className={getButtonClass('right')}
            disabled={selectedSide !== null}
          >
            <div className="text-2xl font-bold capitalize text-blue-600">
              {question.right.word || question.right.label || 'Missing Word'}
            </div>
            
          </button>
        </div>
      </div>

      {/* Action buttons */}
      {!selectedSide && (
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => handleClick('left')}
            className="bg-yellow-400 hover:bg-yellow-500 text-indigo-900 font-black text-xl px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
          >
            {getButtonTexts().left}
          </button>
          <button
            onClick={() => handleClick('right')}
            className="bg-yellow-400 hover:bg-yellow-500 text-indigo-900 font-black text-xl px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
          >
            {getButtonTexts().right}
          </button>
        </div>
      )}
    </div>
  )
}
