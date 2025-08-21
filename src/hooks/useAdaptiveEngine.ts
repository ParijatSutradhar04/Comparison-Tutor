import { useState, useEffect, useCallback } from 'react'
import questionsData from '../data/questions.json'

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
}

const UNDERSTAND_THRESHOLD = 3
const TIMER_SECONDS = 6

export function useAdaptiveEngine() {
  const [state, setState] = useState<AdaptiveEngineState>({
    mode: 'image-mode',
    difficulty: 3,
    currentQuestion: null,
    totalQuestions: 0,
    correctAnswers: 0,
    recentAnswers: [],
    consecutiveCorrect: 0,
    showOverlay: false,
    overlayData: null,
    timerActive: false,
    timerSeconds: TIMER_SECONDS
  })

  const [recentQuestionIds, setRecentQuestionIds] = useState<string[]>([])

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
    console.log(`nextQuestion called with difficulty: ${state.difficulty}, mode: ${state.mode}, class: ${studentClass}, location: ${location}`)
    console.log(`Current recent questions: ${recentQuestionIds.join(', ')}`)
    
    const typedQuestions = questionsData as QuestionItem[]
    
    // First, try to find questions that match exactly and aren't recently used
    let filtered = typedQuestions.filter((q: QuestionItem) => 
      q.mode === state.mode &&
      q.difficulty === state.difficulty &&
      (q.class === studentClass || q.class === 0) &&
      (q.location.includes(location) || q.location.includes('default')) &&
      !recentQuestionIds.includes(q.id)
    )
    console.log(`Exact match candidates: ${filtered.length}`)

    // If no exact matches, expand to ±1 difficulty level
    if (filtered.length === 0) {
      filtered = typedQuestions.filter((q: QuestionItem) => 
        q.mode === state.mode &&
        Math.abs(q.difficulty - state.difficulty) <= 1 &&
        (q.class === studentClass || q.class === 0) &&
        (q.location.includes(location) || q.location.includes('default')) &&
        !recentQuestionIds.includes(q.id)
      )
      console.log(`±1 difficulty candidates: ${filtered.length}`)
    }

    // If still no matches, try any question of the same mode that hasn't been used recently
    if (filtered.length === 0) {
      filtered = typedQuestions.filter((q: QuestionItem) => 
        q.mode === state.mode &&
        !recentQuestionIds.includes(q.id)
      )
      console.log(`Same mode candidates: ${filtered.length}`)
    }

    // If absolutely no unused questions, reset and try again
    if (filtered.length === 0) {
      console.log('No unused questions found, using any question in mode')
      filtered = typedQuestions.filter((q: QuestionItem) => q.mode === state.mode)
      // Reset recent IDs
      setRecentQuestionIds([])
    }

    // Select a random question from the filtered list
    const selectedQuestion = filtered[Math.floor(Math.random() * filtered.length)] || typedQuestions[0]
    console.log(`Selected question: ${selectedQuestion.id}, difficulty: ${selectedQuestion.difficulty}, mode: ${selectedQuestion.mode}`)
    
    setState(prev => ({
      ...prev,
      currentQuestion: selectedQuestion as QuestionItem,
      timerActive: prev.mode === 'word-mode' && !prev.showOverlay && selectedQuestion.mode === 'word-mode',
      timerSeconds: TIMER_SECONDS
    }))
    
    // Update recent questions - keep last 5 questions to avoid repetition
    const updatedRecentIds = [selectedQuestion.id, ...recentQuestionIds.slice(0, 4)]
    console.log(`Updated recent question IDs: ${updatedRecentIds.join(', ')}`)
    setRecentQuestionIds(updatedRecentIds)
  }, [state.difficulty, state.mode, recentQuestionIds])

  const submitAnswer = useCallback((chosenSide: ChosenSide) => {
    if (!state.currentQuestion) return false

    const correct = state.currentQuestion.left.sizeValue > state.currentQuestion.right.sizeValue 
      ? chosenSide === 'left' 
      : chosenSide === 'right'

    const newRecentAnswers = [correct, ...state.recentAnswers.slice(0, 4)]
    const newConsecutiveCorrect = correct ? state.consecutiveCorrect + 1 : 0

    setState(prev => ({
      ...prev,
      totalQuestions: prev.totalQuestions + 1,
      correctAnswers: correct ? prev.correctAnswers + 1 : prev.correctAnswers,
      recentAnswers: newRecentAnswers,
      consecutiveCorrect: newConsecutiveCorrect,
      difficulty: correct 
        ? Math.min(5, prev.difficulty + 1) 
        : Math.max(1, prev.difficulty - 1),
      mode: (newConsecutiveCorrect >= UNDERSTAND_THRESHOLD && prev.mode === 'image-mode') 
        ? 'word-mode' 
        : prev.mode,
      timerActive: false, // Always stop timer after answering
      // Show overlay for incorrect answers in word mode, but only if current question is also word-mode
      showOverlay: !correct && state.mode === 'word-mode' && state.currentQuestion?.mode === 'word-mode',
      overlayData: (!correct && state.mode === 'word-mode' && state.currentQuestion?.mode === 'word-mode') ? state.currentQuestion : prev.overlayData
    }))
    
    return correct
  }, [state.currentQuestion, state.consecutiveCorrect, state.mode])

  const timerExpired = useCallback(() => {
    setState(prev => ({
      ...prev,
      timerActive: false,
      showOverlay: prev.currentQuestion?.mode === 'word-mode',
      overlayData: prev.currentQuestion?.mode === 'word-mode' ? prev.currentQuestion : null,
      totalQuestions: prev.totalQuestions + 1,
      difficulty: Math.max(1, prev.difficulty - 1)
    }))
  }, [])

  const closeOverlay = useCallback((shouldAdvance = false, studentClass?: number, location?: string) => {
    setState(prev => ({
      ...prev,
      showOverlay: false,
      overlayData: null,
      mode: 'image-mode', // Return to image mode after overlay
      difficulty: Math.max(1, prev.difficulty - 1) // Reduce difficulty
    }))
    
    // If called after a wrong answer, advance to next question
    if (shouldAdvance && studentClass && location) {
      setTimeout(() => {
        nextQuestion(studentClass, location)
      }, 200) // Quick delay to let overlay close smoothly
    }
  }, [nextQuestion])

  const reset = useCallback(() => {
    setState({
      mode: 'image-mode',
      difficulty: 3,
      currentQuestion: null,
      totalQuestions: 0,
      correctAnswers: 0,
      recentAnswers: [],
      consecutiveCorrect: 0,
      showOverlay: false,
      overlayData: null,
      timerActive: false,
      timerSeconds: TIMER_SECONDS
    })
    setRecentQuestionIds([])
  }, [])

  const switchToWordMode = useCallback(() => {
    setState(prev => ({ ...prev, mode: 'word-mode' }))
  }, [])

  const forceDifficulty = useCallback((difficulty: number) => {
    setState(prev => ({ ...prev, difficulty: Math.max(1, Math.min(5, difficulty)) }))
  }, [])

  // Demo sequence
  const runDemoSequence = useCallback(async (studentClass: number, location: string) => {
    // Reset first
    reset()
    
    // Simulate 3 correct image questions
    for (let i = 0; i < 3; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      nextQuestion(studentClass, location)
      await new Promise(resolve => setTimeout(resolve, 1000))
      if (state.currentQuestion) {
        const correctSide = state.currentQuestion.left.sizeValue > state.currentQuestion.right.sizeValue ? 'left' : 'right'
        submitAnswer(correctSide)
      }
    }
    
    // Should now be in word mode
    await new Promise(resolve => setTimeout(resolve, 1000))
    nextQuestion(studentClass, location)
    
    // Correct answer in word mode
    await new Promise(resolve => setTimeout(resolve, 1000))
    if (state.currentQuestion) {
      const correctSide = state.currentQuestion.left.sizeValue > state.currentQuestion.right.sizeValue ? 'left' : 'right'
      submitAnswer(correctSide)
    }
    
    // Next word question - simulate timeout
    await new Promise(resolve => setTimeout(resolve, 1000))
    nextQuestion(studentClass, location)
    await new Promise(resolve => setTimeout(resolve, 2000))
    timerExpired()
  }, [nextQuestion, submitAnswer, timerExpired, reset, state.currentQuestion])

  return {
    ...state,
    nextQuestion,
    submitAnswer,
    timerExpired,
    closeOverlay,
    reset,
    switchToWordMode,
    forceDifficulty,
    runDemoSequence
  }
}
