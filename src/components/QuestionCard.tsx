import { useEffect, useState, useRef } from 'react'
import { StudentInfo, useAppContext } from '../contexts/AppContext'
import { AdaptiveEngineState, ChosenSide } from '../hooks/useAdaptiveEngine'
import ImagePair from './ImagePair'
import WordPair from './WordPair'
import Timer from './Timer'
import { fireStarConfetti } from '../utils/confetti'

interface QuestionCardProps {
  engine: AdaptiveEngineState & {
    nextQuestion: (location: string) => void
    submitAnswer: (side: ChosenSide) => boolean
    timerExpired: () => void
    closeOverlay: (shouldAdvance?: boolean, location?: string) => void
  }
  studentInfo: StudentInfo
}

export default function QuestionCard({ engine, studentInfo }: QuestionCardProps) {
  const { strings } = useAppContext()
  const [isProcessing, setIsProcessing] = useState(false)
  const [isPortrait, setIsPortrait] = useState(false)
  const initializedRef = useRef(false)

  // Check if screen is in portrait mode
  useEffect(() => {
    const checkOrientation = () => {
      setIsPortrait(window.innerHeight > window.innerWidth)
    }
    
    checkOrientation()
    window.addEventListener('resize', checkOrientation)
    
    return () => window.removeEventListener('resize', checkOrientation)
  }, [])

  // Get instruction text based on orientation
  const getInstructionText = () => {
    return isPortrait ? 'Choose Top or Bottom' : 'Choose Left or Right'
  }

  useEffect(() => {
    if (!engine.currentQuestion && !initializedRef.current) {
      initializedRef.current = true
      engine.nextQuestion(studentInfo.location)
    }
  }, []) // Remove dependencies that cause infinite loops

  // Force reload question when difficulty crosses mode boundary (3↔4)
  useEffect(() => {
    if (engine.currentQuestion) {
      const expectedMode = engine.difficulty >= 4 ? 'word-mode' : 'image-mode'
      if (engine.currentQuestion.mode !== expectedMode) {
        console.log('Mode mismatch detected, reloading question:', {
          difficulty: engine.difficulty,
          expectedMode,
          currentQuestionMode: engine.currentQuestion.mode
        })
        engine.nextQuestion(studentInfo.location)
      }
    }
  }, [engine.difficulty, engine.currentQuestion, engine, studentInfo])

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
    
    // Only manually advance if we'll show overlay
    // For correct answers, the auto-advance mechanism will handle it
    const willShowOverlay = !isCorrect
    
    if (willShowOverlay) {
      // For overlay cases, clear processing immediately since overlay handles the flow
      setIsProcessing(false)
    } else {
      // For correct answers, the auto-advance will handle progression
      // Just clear processing after a short delay for UX
      setTimeout(() => {
        setIsProcessing(false)
      }, isCorrect && studentInfo.funMode ? 800 : 300)
    }
  }

  return (
    <div className="relative">
      {/* Main question container - matching the mockup's purple rounded design */}
      <div className="bg-white rounded-[2rem] shadow-2xl border-4 border-indigo-600 p-8 relative overflow-hidden">
        {/* Decorative corner elements */}
        <div className="absolute top-4 left-4 w-3 h-3 bg-yellow-400 rounded-full"></div>
        <div className="absolute top-4 right-4 w-3 h-3 bg-pink-400 rounded-full"></div>
        <div className="absolute bottom-4 left-4 w-3 h-3 bg-green-400 rounded-full"></div>
        <div className="absolute bottom-4 right-4 w-3 h-3 bg-blue-400 rounded-full"></div>
        
        {/* Processing overlay for immediate feedback */}
        {isProcessing && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-[2rem]">
            <div className="text-center">
              <div className="animate-pulse w-8 h-8 bg-green-500 rounded-full mx-auto mb-2"></div>
              <p className="text-sm text-gray-600 font-medium">Processing...</p>
            </div>
          </div>
        )}
        
        {/* Header section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <span className={`px-4 py-2 rounded-full text-sm font-bold shadow-lg ${
              engine.difficulty <= 3 
                ? 'bg-blue-500 text-white' 
                : 'bg-purple-500 text-white'
            }`}>
              {engine.difficulty <= 3 
                ? (strings.imageMode || 'Image Mode')
                : (strings.wordMode || 'Word Mode')
              }
            </span>
            
            <span className="bg-gradient-to-r from-orange-400 to-pink-400 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
              {`${strings.difficulty || 'Difficulty'} ${engine.difficulty}/5`}
            </span>

            {engine.difficulty === 5 && engine.timerActive && (
              <>
                {console.log(`🖥️ QUESTIONCARD: Showing timer - difficulty=${engine.difficulty}, timerActive=${engine.timerActive}, timerSeconds=${engine.timerSeconds}`)}
                <Timer 
                  seconds={engine.timerSeconds}
                  onExpired={engine.timerExpired}
                />
              </>
            )}
          </div>

          <h2 className="text-4xl font-black text-indigo-800 mb-3 font-display">
            {strings.whichHasMore || 'Which is bigger?'}
          </h2>
          <p className="text-lg text-indigo-600 font-semibold">
            {getInstructionText()}
          </p>
        </div>

        {/* Question content */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6">
          {engine.difficulty <= 3 && engine.currentQuestion?.mode === 'image-mode' ? (
            <ImagePair
              question={engine.currentQuestion}
              onAnswer={handleAnswer}
              difficulty={engine.difficulty}
            />
          ) : engine.difficulty >= 4 && engine.currentQuestion?.mode === 'word-mode' ? (
            <WordPair
              question={engine.currentQuestion}
              onAnswer={handleAnswer}
            />
          ) : (
            <div className="text-center text-gray-500 p-8">
              <p>Question mode mismatch detected</p>
              <p>Difficulty: {engine.difficulty}, Question Mode: {engine.currentQuestion?.mode}</p>
              <button 
                onClick={() => engine.nextQuestion(studentInfo.location)}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
              >
                Load Next Question
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
