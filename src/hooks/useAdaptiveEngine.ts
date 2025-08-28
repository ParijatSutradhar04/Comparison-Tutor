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

export function useAdaptiveEngine(studentInfo?: { class: number; location: string }) {
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

  const nextQuestion = useCallback((location: string = 'India') => {
    // Determine the current effective mode based on difficulty
    const effectiveMode = state.difficulty >= 4 ? 'word-mode' : 'image-mode'
    console.log(`nextQuestion called with difficulty: ${state.difficulty}, effectiveMode: ${effectiveMode}, location: ${location}`)
    console.log(`🌍 LOCATION DEBUG: Looking for questions with location: "${location}"`)
    
    let selectedQuestion: QuestionItem
    
    if (effectiveMode === 'word-mode') {
      // DIFFICULTY 4-5: Use word questions with priority-based location filtering
      const allWordQuestions = getQuestionsByMode('word-mode') as QuestionItem[]
      console.log(`Word difficulty ${state.difficulty}: Starting word question selection for "${location}"`)
      
      // PRIORITY 1: First, try questions that match exact location (not default) for current difficulty
      let filteredWordQuestions = allWordQuestions.filter((q: QuestionItem) => 
        q.mode === 'word-mode' &&
        q.difficulty === state.difficulty &&
        q.location.includes(location) && // Only exact location match
        !q.location.includes('default') // Exclude default questions in first pass
      )
      console.log(`🔍 WORD PRIORITY 1: Exact location "${location}" questions found: ${filteredWordQuestions.length}`)
      console.log(`Word questions (exact location):`, filteredWordQuestions.map(q => `${q.id} (locations: [${q.location.join(', ')}])`))
      
      // PRIORITY 2: If no exact location matches, try default questions for current difficulty
      if (filteredWordQuestions.length === 0) {
        filteredWordQuestions = allWordQuestions.filter((q: QuestionItem) => 
          q.mode === 'word-mode' &&
          q.difficulty === state.difficulty &&
          q.location.includes('default') // Only default questions
        )
        console.log(`🔍 WORD PRIORITY 2: Default questions found: ${filteredWordQuestions.length}`)
        console.log(`Word questions (default):`, filteredWordQuestions.map(q => `${q.id} (locations: [${q.location.join(', ')}])`))
      }
      
      // PRIORITY 3: If still no matches, fallback to any word question of current difficulty
      if (filteredWordQuestions.length === 0) {
        filteredWordQuestions = allWordQuestions.filter((q: QuestionItem) => 
          q.mode === 'word-mode' &&
          q.difficulty === state.difficulty
        )
        console.log(`🔍 WORD PRIORITY 3: Any difficulty ${state.difficulty} questions found: ${filteredWordQuestions.length}`)
      }
      
      if (filteredWordQuestions.length === 0) {
        // Final fallback to any word question if no matching difficulty found
        console.warn(`No word questions found for difficulty ${state.difficulty}, using any available word question`)
        filteredWordQuestions = allWordQuestions.filter(q => q.mode === 'word-mode')
      }
      
      if (filteredWordQuestions.length > 0) {
        // Select question based on current index (sequential order)  
        const currentDifficultyIndex = wordQuestionIndices[state.difficulty] || 0
        const questionIndex = currentDifficultyIndex % filteredWordQuestions.length
        selectedQuestion = filteredWordQuestions[questionIndex]
        console.log(`Selected word question ${questionIndex + 1}/${filteredWordQuestions.length}: ${selectedQuestion.id}`)
        
        // Increment index for next word question
        setWordQuestionIndices(prev => ({
          ...prev,
          [state.difficulty]: (prev[state.difficulty] || 0) + 1
        }))
      } else {
        console.error('No valid word questions available!')
        selectedQuestion = allWordQuestions[0] || { id: 'fallback', mode: 'word-mode' } as QuestionItem
      }
      
    } else {
      // DIFFICULTY 1-3: Use image questions - STRICT difficulty matching only
      const typedQuestions = imageQuestions as QuestionItem[]
      
      // PRIORITY 1: First, try to find questions that match exactly with selected location (not default) and aren't recently used
      let filtered = typedQuestions.filter((q: QuestionItem) => 
        q.mode === 'image-mode' &&
        q.difficulty === state.difficulty &&
        q.location.includes(location) && // Only exact location match
        !q.location.includes('default') && // Exclude default questions in first pass
        !recentQuestionIds.includes(q.id)
      )
      console.log(`Image difficulty ${state.difficulty}: Exact location match candidates: ${filtered.length}`)
      console.log(`🔍 LOCATION FILTER DEBUG - Step 1: Questions found for exact "${location}":`, 
        filtered.map(q => `${q.id} (class: ${q.class}, locations: [${q.location.join(', ')}])`)
      )

      // PRIORITY 2: If no exact location matches, try default questions that aren't recently used
      if (filtered.length === 0) {
        filtered = typedQuestions.filter((q: QuestionItem) => 
          q.mode === 'image-mode' &&
          q.difficulty === state.difficulty &&
          q.location.includes('default') && // Only default questions
          !recentQuestionIds.includes(q.id)
        )
        console.log(`Image difficulty ${state.difficulty}: Default location candidates: ${filtered.length}`)
        console.log(`🔍 LOCATION FILTER DEBUG - Step 2: Default questions found:`, 
          filtered.map(q => `${q.id} (class: ${q.class}, locations: [${q.location.join(', ')}])`)
        )
      }

      // PRIORITY 3: If no location-specific or default matches, try exact location with recently used questions
      if (filtered.length === 0) {
        filtered = typedQuestions.filter((q: QuestionItem) => 
          q.mode === 'image-mode' &&
          q.difficulty === state.difficulty &&
          q.location.includes(location) && // Only exact location match
          !q.location.includes('default') // Exclude default questions
        )
        console.log(`Image difficulty ${state.difficulty}: Exact location (with recent) candidates: ${filtered.length}`)
        console.log(`🔍 LOCATION FILTER DEBUG - Step 3: Exact location with recent:`, 
          filtered.map(q => `${q.id} (class: ${q.class}, locations: [${q.location.join(', ')}])`)
        )
        // Reset recent IDs since we're allowing previously used questions
        if (filtered.length > 0) {
          setRecentQuestionIds([])
        }
      }

      // PRIORITY 4: If still no matches, allow default questions with recently used
      if (filtered.length === 0) {
        filtered = typedQuestions.filter((q: QuestionItem) => 
          q.mode === 'image-mode' &&
          q.difficulty === state.difficulty &&
          q.location.includes('default')
        )
        console.log(`Image difficulty ${state.difficulty}: Default (with recent) candidates: ${filtered.length}`)
        console.log(`🔍 LOCATION FILTER DEBUG - Step 4: Default with recent:`, 
          filtered.map(q => `${q.id} (class: ${q.class}, locations: [${q.location.join(', ')}])`)
        )
        // Reset recent IDs since we're allowing previously used questions
        setRecentQuestionIds([])
      }

      // Final fallback: if absolutely no questions exist for this difficulty, use any available
      if (filtered.length === 0) {
        console.warn(`No questions found for difficulty ${state.difficulty}, using any image question as fallback`)
        filtered = typedQuestions.filter((q: QuestionItem) => q.mode === 'image-mode')
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
  }, [state.difficulty, state.mode, recentQuestionIds, wordQuestionIndices, getQuestionsByMode])

  // Auto-advance to next question after state updates
  useEffect(() => {
    if (state.shouldAdvanceQuestion && !state.showOverlay) {
      console.log(`🚀 AUTO-ADVANCE: Advancing to next question with updated difficulty: ${state.difficulty}`)
      // Clear the flag first
      setState(prev => ({ ...prev, shouldAdvanceQuestion: false }))
      // Then advance to next question with a small delay to ensure state is updated
      setTimeout(() => {
        const defaultLocation = studentInfo?.location || 'India'
        console.log(`🚀 AUTO-ADVANCE: Using location: "${defaultLocation}"`)
        nextQuestion(defaultLocation)
      }, 100)
    }
  }, [state.shouldAdvanceQuestion, state.showOverlay, state.difficulty, nextQuestion, studentInfo])

  const submitAnswer = useCallback((chosenSide: ChosenSide) => {
    if (!state.currentQuestion) return false

    const correct = state.currentQuestion.left.sizeValue > state.currentQuestion.right.sizeValue 
      ? chosenSide === 'left' 
      : chosenSide === 'right'

    const newRecentAnswers = [correct, ...state.recentAnswers.slice(0, 4)]
    const newConsecutiveCorrect = correct ? state.consecutiveCorrect + 1 : 0
    const newDifficulty = correct 
      ? Math.min(5, state.difficulty + 1) // Increase difficulty on every correct answer
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

  const closeOverlay = useCallback((shouldAdvance = false, location?: string) => {
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
    if (shouldAdvance && location) {
      setTimeout(() => {
        nextQuestion(location)
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
