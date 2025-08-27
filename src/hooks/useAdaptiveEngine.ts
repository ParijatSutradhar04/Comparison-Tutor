import { useState, useEffect, useCallback } from 'react'
import imageQuestions from '../data/imageQuestions.json'
import wordQuestions from '../data/wordQuestions.json'

export type Mode = 'image-mode' | 'word-mode'
export type ChosenSide = 'left' | 'right'

export interface QuestionItem {
  id: string
  mode: Mode
  difficulty: number
  class: number
  location: string[]
  left: {
    src?: string
    word?: string
    label: string
    size: 'large' | 'medium' | 'small'
    sizeValue: number // numerical value for comparison (1-10 scale)
    image?: string
  }
  right: {
    src?: string
    word?: string
    label: string
    size: 'large' | 'medium' | 'small'
    sizeValue: number // numerical value for comparison (1-10 scale)
    image?: string
  }
  explanationSimple: Record<string, string>
}

export interface AdaptiveEngineState {
  mode: Mode
  difficulty: number
  currentQuestion: QuestionItem | null
  totalQuestions: number
  correctAnswers: number
  recentAnswers: boolean[]
  consecutiveCorrect: number
  showOverlay: boolean
  overlayData: QuestionItem | null
  timerActive: boolean
  timerSeconds: number
  shouldAdvanceQuestion?: boolean
}

const TIMER_SECONDS = 6

export function useAdaptiveEngine() {
  const [state, setState] = useState<AdaptiveEngineState>({
    mode: 'image-mode',
    difficulty: 1, // Start with difficulty level 1
    currentQuestion: null,
    totalQuestions: 0,
    correctAnswers: 0,
    recentAnswers: [],
    consecutiveCorrect: 0,
    showOverlay: false,
    overlayData: null,
    timerActive: false,
    timerSeconds: TIMER_SECONDS,
    shouldAdvanceQuestion: false
  })

  const [recentQuestionIds, setRecentQuestionIds] = useState<string[]>([])
  const [wordQuestionIndices, setWordQuestionIndices] = useState<Record<number, number>>({4: 0, 5: 0})

  // Separate questions by mode
  const getQuestionsByMode = useCallback((mode: Mode) => {
    if (mode === 'image-mode') {
      return imageQuestions as QuestionItem[]
    } else {
      return wordQuestions as QuestionItem[]
    }
  }, [])

  // Get word questions in order for sequential selection
  const getOrderedWordQuestions = useCallback((location: string) => {
    const wordQuestions = getQuestionsByMode('word-mode')
    // For word questions, we want them in the EXACT order they appear in the JSON file
    // No sorting - preserve the original file order
    return wordQuestions.filter((q: QuestionItem) => 
      q.mode === 'word-mode' &&
      (q.location.includes(location) || q.location.includes('default'))
    )
    // No .sort() here - preserve original JSON file order
  }, [getQuestionsByMode])

  // Timer effect
  useEffect(() => {
    let interval: number
    if (state.timerActive && state.timerSeconds > 0) {
      interval = window.setInterval(() => {
        setState(prev => ({
          ...prev,
          timerSeconds: prev.timerSeconds - 1
        }))
      }, 1000)
    } else if (state.timerActive && state.timerSeconds === 0) {
      // Timer expired
      timerExpired()
    }
    return () => clearInterval(interval)
  }, [state.timerActive, state.timerSeconds])

  const nextQuestion = useCallback((studentClass: number = 3, location: string = 'India') => {
    // Determine the current effective mode based on difficulty
    const effectiveMode = state.difficulty >= 4 ? 'word-mode' : 'image-mode'
    console.log(`nextQuestion called with difficulty: ${state.difficulty}, effectiveMode: ${effectiveMode}, class: ${studentClass}, location: ${location}`)
    
    let selectedQuestion: QuestionItem
    
    if (effectiveMode === 'word-mode') {
      // DIFFICULTY 4-5: Use word questions
      const orderedWordQuestions = getOrderedWordQuestions(location)
      console.log(`Word difficulty ${state.difficulty}: ${orderedWordQuestions.length} ordered questions available`)
      console.log(`Word questions found:`, orderedWordQuestions.map(q => `${q.id} (diff: ${q.difficulty}, class: ${q.class})`))
      
      // Filter word questions for the current difficulty level
      const difficultyWordQuestions = orderedWordQuestions.filter(q => q.difficulty === state.difficulty)
      console.log(`Difficulty ${state.difficulty} word questions found: ${difficultyWordQuestions.length}`)
      
      if (difficultyWordQuestions.length === 0) {
        // Fallback to any word question if no matching difficulty found
        console.warn(`No word questions found for difficulty ${state.difficulty}, using fallback`)
        const allWordQuestions = getQuestionsByMode('word-mode')
        const currentDifficultyIndex = wordQuestionIndices[state.difficulty] || 0
        const fallbackQuestion = allWordQuestions[currentDifficultyIndex % allWordQuestions.length] || allWordQuestions[0]
        if (fallbackQuestion && fallbackQuestion.mode === 'word-mode') {
          selectedQuestion = fallbackQuestion
        } else {
          console.error('No valid word questions available!')
          selectedQuestion = allWordQuestions[0] || { id: 'fallback', mode: 'word-mode' } as QuestionItem
        }
      } else {
        // Select question based on current index (sequential order)  
        const currentDifficultyIndex = wordQuestionIndices[state.difficulty] || 0
        const questionIndex = currentDifficultyIndex % difficultyWordQuestions.length
        selectedQuestion = difficultyWordQuestions[questionIndex]
        console.log(`Selected difficulty ${state.difficulty} word question ${questionIndex + 1}/${difficultyWordQuestions.length}: ${selectedQuestion.id}`)
      }
      
      // Increment index for next word question
      setWordQuestionIndices(prev => ({
        ...prev,
        [state.difficulty]: (prev[state.difficulty] || 0) + 1
      }))
      const currentDifficultyIndex = wordQuestionIndices[state.difficulty] || 0
      console.log(`Selected word question: ${selectedQuestion.id} (index was: ${currentDifficultyIndex}, now: ${currentDifficultyIndex + 1})`)
      
    } else {
      // DIFFICULTY 1-3: Use image questions
      const typedQuestions = imageQuestions as QuestionItem[]
      
      // First, try to find questions that match exactly and aren't recently used
      let filtered = typedQuestions.filter((q: QuestionItem) => 
        q.mode === 'image-mode' &&
        q.difficulty === state.difficulty &&
        (q.class === studentClass || q.class === 0) &&
        (q.location.includes(location) || q.location.includes('default')) &&
        !recentQuestionIds.includes(q.id)
      )
      console.log(`Image difficulty ${state.difficulty}: Exact match candidates: ${filtered.length}`)

      // If no exact matches, expand to ±1 difficulty level
      if (filtered.length === 0) {
        filtered = typedQuestions.filter((q: QuestionItem) => 
          q.mode === 'image-mode' &&
          Math.abs(q.difficulty - state.difficulty) <= 1 &&
          (q.class === studentClass || q.class === 0) &&
          (q.location.includes(location) || q.location.includes('default')) &&
          !recentQuestionIds.includes(q.id)
        )
        console.log(`Image difficulty ${state.difficulty}: ±1 difficulty candidates: ${filtered.length}`)
      }

      // If still no matches, try any image question that hasn't been used recently
      if (filtered.length === 0) {
        filtered = typedQuestions.filter((q: QuestionItem) => 
          q.mode === 'image-mode' &&
          !recentQuestionIds.includes(q.id)
        )
        console.log(`Image difficulty ${state.difficulty}: Any image question candidates: ${filtered.length}`)
      }

      // If absolutely no unused questions, reset and try again
      if (filtered.length === 0) {
        console.log('Image questions: No unused questions found, using any image question')
        filtered = typedQuestions.filter((q: QuestionItem) => q.mode === 'image-mode')
        // Reset recent IDs for image mode
        setRecentQuestionIds([])
      }

      // Select a random question from the filtered list
      selectedQuestion = filtered[Math.floor(Math.random() * filtered.length)] || typedQuestions[0]
      console.log(`Selected image question: ${selectedQuestion.id}, difficulty: ${selectedQuestion.difficulty}`)
      
      // Update recent questions for image mode only - keep last 5 questions to avoid repetition
      const updatedRecentIds = [selectedQuestion.id, ...recentQuestionIds.slice(0, 4)]
      console.log(`Updated recent question IDs: ${updatedRecentIds.join(', ')}`)
      setRecentQuestionIds(updatedRecentIds)
    }
    
    // Determine the correct mode based on difficulty
    const correctMode = state.difficulty >= 4 ? 'word-mode' : 'image-mode'
    
    // DEBUG: Timer activation logic
    console.log(`🔥 TIMER DEBUG - About to set question:`)
    console.log(`   - selectedQuestion.difficulty: ${selectedQuestion.difficulty}`)
    console.log(`   - selectedQuestion.mode: ${selectedQuestion.mode}`)
    console.log(`   - Will activate timer: ${selectedQuestion.difficulty === 5 && selectedQuestion.mode === 'word-mode'}`)
    console.log(`   - Current state.difficulty: ${state.difficulty}`)
    
    setState(prev => ({
      ...prev,
      mode: correctMode, // Ensure mode is synchronized with difficulty
      currentQuestion: selectedQuestion as QuestionItem,
      // Timer logic: Only for difficulty 5 (word questions)
      timerActive: selectedQuestion.difficulty === 5 && selectedQuestion.mode === 'word-mode',
      timerSeconds: TIMER_SECONDS
    }))
  }, [state.difficulty, state.mode, recentQuestionIds, wordQuestionIndices, getOrderedWordQuestions, getQuestionsByMode])

  // Auto-advance to next question after state updates
  useEffect(() => {
    if (state.shouldAdvanceQuestion && !state.showOverlay) {
      console.log(`🚀 AUTO-ADVANCE: Advancing to next question with updated difficulty: ${state.difficulty}`)
      // Clear the flag first
      setState(prev => ({ ...prev, shouldAdvanceQuestion: false }))
      // Then advance to next question with a small delay to ensure state is updated
      setTimeout(() => {
        nextQuestion(3, 'Maharashtra') // TODO: Get these from context
      }, 100)
    }
  }, [state.shouldAdvanceQuestion, state.showOverlay, state.difficulty, nextQuestion])

  const submitAnswer = useCallback((chosenSide: ChosenSide) => {
    if (!state.currentQuestion) return false

    const correct = state.currentQuestion.left.sizeValue > state.currentQuestion.right.sizeValue 
      ? chosenSide === 'left' 
      : chosenSide === 'right'

    const newRecentAnswers = [correct, ...state.recentAnswers.slice(0, 4)]
    const newConsecutiveCorrect = correct ? state.consecutiveCorrect + 1 : 0
    const newDifficulty = correct 
      ? (newConsecutiveCorrect >= 2 && newConsecutiveCorrect % 2 === 0 ? Math.min(5, state.difficulty + 1) : state.difficulty)
      : (state.difficulty === 5 ? 5 : Math.max(1, state.difficulty - 1)) // Don't decrease from difficulty 5
    
    // DEBUG: Difficulty change logic
    console.log(`🎯 DIFFICULTY DEBUG - submitAnswer:`)
    console.log(`   - Answer was: ${correct ? 'CORRECT' : 'WRONG'}`)
    console.log(`   - Old difficulty: ${state.difficulty}`)
    console.log(`   - New difficulty: ${newDifficulty}`)
    console.log(`   - consecutiveCorrect: ${newConsecutiveCorrect}`)
    console.log(`   - Will difficulty decrease? ${!correct && state.difficulty === 5 ? 'NO (protected)' : (!correct ? 'YES' : 'N/A')}`)
    
    // Set mode based on difficulty: 1-3 = image-mode, 4-5 = word-mode
    const newMode = newDifficulty >= 4 ? 'word-mode' : 'image-mode'
    
    setState(prev => ({
      ...prev,
      totalQuestions: prev.totalQuestions + 1,
      correctAnswers: correct ? prev.correctAnswers + 1 : prev.correctAnswers,
      recentAnswers: newRecentAnswers,
      consecutiveCorrect: newConsecutiveCorrect,
      difficulty: newDifficulty,
      mode: newMode,
      timerActive: false, // Always stop timer after answering
      // Show overlay for incorrect answers in both image and word mode
      showOverlay: !correct,
      overlayData: !correct ? state.currentQuestion : prev.overlayData,
      // Add flag to indicate we need to advance to next question
      shouldAdvanceQuestion: true
    }))
    
    return correct
  }, [state.currentQuestion, state.consecutiveCorrect, state.difficulty])

  const timerExpired = useCallback(() => {
    console.log(`⏱️ TIMER EXPIRED - Current difficulty: ${state.difficulty}`)
    setState(prev => ({
      ...prev,
      timerActive: false,
      showOverlay: prev.currentQuestion?.mode === 'word-mode',
      overlayData: prev.currentQuestion?.mode === 'word-mode' ? prev.currentQuestion : null,
      totalQuestions: prev.totalQuestions + 1,
      difficulty: prev.difficulty === 5 ? 5 : Math.max(1, prev.difficulty - 1) // Protect difficulty 5
    }))
    console.log(`⏱️ TIMER EXPIRED - New difficulty should be: ${state.difficulty === 5 ? 5 : Math.max(1, state.difficulty - 1)}`)
  }, [state.difficulty])

  const closeOverlay = useCallback((shouldAdvance = false, studentClass?: number, location?: string) => {
    console.log(`📋 OVERLAY CLOSED - No difficulty change on overlay close`)
    setState(prev => ({
      ...prev,
      showOverlay: false,
      overlayData: null
      // Don't change difficulty when just closing overlay
    }))
    
    // Only reset word mode index when actually switching away from word mode
    // Don't reset it here since we want to maintain sequential progression
    
    // If called after a wrong answer, advance to next question
    if (shouldAdvance && studentClass && location) {
      setTimeout(() => {
        nextQuestion(studentClass, location)
      }, 200) // Quick delay to let overlay close smoothly
    }
  }, [nextQuestion])

  const reset = useCallback(() => {
    setState({
      mode: 'image-mode', // Start with image mode (difficulty 1-3)
      difficulty: 1, // Reset to difficulty level 1
      currentQuestion: null,
      totalQuestions: 0,
      correctAnswers: 0,
      recentAnswers: [],
      consecutiveCorrect: 0,
      showOverlay: false,
      overlayData: null,
      timerActive: false,
      timerSeconds: TIMER_SECONDS,
      shouldAdvanceQuestion: false
    })
    setRecentQuestionIds([])
    setWordQuestionIndices({4: 0, 5: 0}) // Reset word mode indices
  }, [])

  return {
    ...state,
    nextQuestion,
    submitAnswer,
    timerExpired,
    closeOverlay,
    reset
  }
}
