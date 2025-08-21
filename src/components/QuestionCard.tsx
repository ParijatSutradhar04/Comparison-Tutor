import { useEffect, useState } from 'react'
import { StudentInfo, useAppContext } from '../App'
import { AdaptiveEngineState, ChosenSide } from '../hooks/useAdaptiveEngine'
import ImagePair from './ImagePair'
import WordPair from './WordPair'
import Timer from './Timer'
import { fireStarConfetti } from '../utils/confetti'

interface QuestionCardProps {
  engine: AdaptiveEngineState & {
    nextQuestion: (studentClass: number, location: string) => void
    submitAnswer: (side: ChosenSide) => boolean
    timerExpired: () => void
    closeOverlay: (shouldAdvance?: boolean, studentClass?: number, location?: string) => void
  }
  studentInfo: StudentInfo
}

export default function QuestionCard({ engine, studentInfo }: QuestionCardProps) {
  const { strings } = useAppContext()
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    if (!engine.currentQuestion) {
      engine.nextQuestion(studentInfo.class, studentInfo.location)
    }
  }, [engine, studentInfo])

  if (!engine.currentQuestion) {
    return (
      <div className="card text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-gray-600">{strings.loading || 'Loading...'}</p>
      </div>
    )
  }

  const handleAnswer = (side: ChosenSide) => {
    setIsProcessing(true) // Show processing state
    const isCorrect = engine.submitAnswer(side)
    
    // Trigger confetti celebration for correct answers if fun mode is enabled
    if (isCorrect && studentInfo.funMode) {
      fireStarConfetti()
    }
    
    // Only advance to next question if we won't show overlay
    // In word-mode, wrong answers show overlay and should not auto-advance
    const willShowOverlay = !isCorrect && engine.mode === 'word-mode'
    
    if (!willShowOverlay) {
      // Different delays based on mode and correctness for better UX
      let delay = 300 // Default quick delay for image mode
      
      if (engine.mode === 'word-mode') {
        // In word mode, give a bit more time to see the feedback
        delay = isCorrect ? 1000 : 300
      }
      
      // Give extra time for confetti if it was triggered
      if (isCorrect && studentInfo.funMode) {
        delay = Math.max(delay, 800) // Ensure at least 800ms to see confetti
      }
      
      setTimeout(() => {
        engine.nextQuestion(studentInfo.class, studentInfo.location)
        setIsProcessing(false) // Clear processing state
      }, delay)
    } else {
      // For overlay cases, clear processing immediately since overlay handles the flow
      setIsProcessing(false)
    }
  }

  return (
    <div className="card relative">
      {/* Processing overlay for immediate feedback */}
      {isProcessing && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
          <div className="text-center">
            <div className="animate-pulse w-8 h-8 bg-green-500 rounded-full mx-auto mb-2"></div>
            <p className="text-sm text-gray-600 font-medium">Processing...</p>
          </div>
        </div>
      )}
      
      <div className="text-center mb-6">
        <div className="flex items-center justify-center space-x-4 mb-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            engine.mode === 'image-mode' 
              ? 'bg-blue-100 text-blue-800' 
              : 'bg-purple-100 text-purple-800'
          }`}>
            {engine.mode === 'image-mode' 
              ? (strings.imageMode || 'Image Mode')
              : (strings.wordMode || 'Word Mode')
            }
          </span>
          
          <span className="bg-gray-100 px-3 py-1 rounded-full text-sm font-medium">
            {strings.difficulty || 'Difficulty'} {engine.difficulty}/5
          </span>

          {engine.mode === 'word-mode' && engine.timerActive && (
            <Timer 
              seconds={engine.timerSeconds}
              onExpired={engine.timerExpired}
            />
          )}
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {strings.whichHasMore || 'Which has more?'}
        </h2>
        <p className="text-gray-600">
          {strings.chooseLeftOrRight || 'Choose Left or Right'}
        </p>
      </div>

      {engine.mode === 'image-mode' ? (
        <ImagePair
          question={engine.currentQuestion}
          onAnswer={handleAnswer}
        />
      ) : (
        <WordPair
          question={engine.currentQuestion}
          onAnswer={handleAnswer}
          showTimer={engine.timerActive}
        />
      )}
    </div>
  )
}
