import { QuestionItem } from '../hooks/useAdaptiveEngine'

export function explainSimple(question: QuestionItem, language: string = 'en'): string {
  // Try to get explanation from dataset first
  const explanation = question.explanationSimple[language] || question.explanationSimple['en']
  
  if (explanation) {
    return explanation
  }

  // Fallback: generate simple explanation
  const leftCount = question.left.sizeValue
  const rightCount = question.right.sizeValue
  const leftLabel = question.left.label || question.left.word || 'items'
  const rightLabel = question.right.label || question.right.word || 'items'

  if (language === 'hi') {
    if (leftCount > rightCount) {
      return `बाएं में ${leftCount} ${leftLabel} हैं, दाएं में ${rightCount}। ${leftCount}, ${rightCount} से बड़ा है।`
    } else {
      return `दाएं में ${rightCount} ${rightLabel} हैं, बाएं में ${leftCount}। ${rightCount}, ${leftCount} से बड़ा है।`
    }
  } else {
    // English
    if (leftCount > rightCount) {
      return `Left has ${leftCount} ${leftLabel}, right has ${rightCount}. ${leftCount} is greater than ${rightCount}.`
    } else {
      return `Right has ${rightCount} ${rightLabel}, left has ${leftCount}. ${rightCount} is greater than ${leftCount}.`
    }
  }
}

// Simulate LLM explanation generation
export async function generateExplanation(question: QuestionItem, language: string = 'en'): Promise<string> {
  // In a real app, this would call an LLM API
  // For demo purposes, we'll just use the simple explanation with a delay
  await new Promise(resolve => setTimeout(resolve, 500)) // Simulate API call
  
  return explainSimple(question, language)
}
