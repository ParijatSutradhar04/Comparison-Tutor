import { useState } from 'react'
import { QuestionItem, ChosenSide } from '../hooks/useAdaptiveEngine'

interface ImagePairProps {
  question: QuestionItem
  onAnswer: (side: ChosenSide) => void
  difficulty?: number // Add difficulty prop to control label visibility
}

export default function ImagePair({ question, onAnswer, difficulty = 1 }: ImagePairProps) {
  const [selectedSide, setSelectedSide] = useState<ChosenSide | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)

  const correctSide: ChosenSide = question.left.sizeValue > question.right.sizeValue ? 'left' : 'right'
  
  // Show labels only for difficulty 1-2, hide for difficulty 3+
  const showLabels = difficulty <= 2

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
    let baseClass = 'bg-white border-4 border-sky-300 rounded-3xl p-6 hover:border-indigo-500 transition-all duration-300 cursor-pointer active:scale-95 shadow-xl hover:shadow-2xl min-h-[300px] flex flex-col items-center justify-center space-y-4 hover:scale-105'
    
    if (showFeedback && selectedSide) {
      if (side === correctSide) {
        baseClass += ' !border-green-500 !bg-green-50 scale-105'
      } else if (side === selectedSide) {
        baseClass += ' !border-red-500 !bg-red-50 scale-95'
      }
    }
    
    return baseClass
  }

  // Try to render actual image first, fallback to generated placeholder
  const renderImage = (src: string | undefined, sizeValue: number, label: string, size: string) => {
    console.log('ImagePair renderImage called with:', { src, sizeValue, label, size })
    
    if (src) {
      console.log('Attempting to load image:', src)
      return (
        <div className="relative">
          <img
            src={src}
            alt={`${size} ${label}`}
            className="w-32 h-32 object-contain border-2 border-gray-300 rounded-lg mx-auto"
            onLoad={() => console.log('Image loaded successfully:', src)}
            onError={(e) => {
              console.log(`Failed to load image: ${src}`)
              // If image fails to load, replace with placeholder
              const target = e.target as HTMLImageElement
              const container = target.parentElement
              if (container) {
                container.innerHTML = generatePlaceholderHTML(sizeValue, label, size)
              }
            }}
          />
        </div>
      )
    }
    
    console.log('No src provided, using placeholder for:', sizeValue, label, size)
    return generatePlaceholderSVG(sizeValue, label, size)
  }

  // Generate placeholder SVG as JSX for size-based display
  const generatePlaceholderSVG = (sizeValue: number, label: string, size: string) => {
    // Use size to determine visual representation
    const circleSize = size === 'large' ? 12 : size === 'medium' ? 8 : 4
    
    return (
      <svg width="120" height="120" viewBox="0 0 120 120" className="border-2 border-gray-300 rounded-lg mx-auto">
        <rect width="120" height="120" fill="#f3f4f6" />
        {/* Show label only for difficulty 1-2 */}
        {showLabels && (
          <text x="60" y="15" textAnchor="middle" className="fill-gray-600 text-xs font-medium">
            {size} {label}
          </text>
        )}
        {/* Single representation scaled by size */}
        <circle
          cx="60"
          cy="60"
          r={circleSize}
          fill="#6366f1"
          opacity="0.8"
        />
        <text x="60" y="110" textAnchor="middle" className="fill-gray-500 text-xs">
          Size: {sizeValue}/10
        </text>
      </svg>
    )
  }

  // Generate placeholder HTML string for error fallback
  const generatePlaceholderHTML = (sizeValue: number, label: string, size: string) => {
    const circleSize = size === 'large' ? 12 : size === 'medium' ? 8 : 4
    const labelHTML = showLabels ? `<text x="60" y="15" text-anchor="middle" class="fill-gray-600 text-xs font-medium">${size} ${label}</text>` : ''
    
    return `
      <svg width="120" height="120" viewBox="0 0 120 120" class="border-2 border-gray-300 rounded-lg mx-auto">
        <rect width="120" height="120" fill="#f3f4f6" />
        ${labelHTML}
        <circle cx="60" cy="60" r="${circleSize}" fill="#6366f1" opacity="0.8" />
        <text x="60" y="110" text-anchor="middle" class="fill-gray-500 text-xs">Size: ${sizeValue}/10</text>
      </svg>
    `
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Left Side */}
        <div className="flex flex-col items-center">
          <h3 className="text-2xl font-bold mb-6 text-indigo-800 font-display">Left</h3>
          <button
            onClick={() => handleClick('left')}
            className={getButtonClass('left')}
            disabled={selectedSide !== null}
          >
            <div className="bg-sky-50 rounded-2xl p-4 mb-4 border-2 border-sky-200">
              {renderImage(question.left.src, question.left.sizeValue, question.left.label, question.left.size)}
            </div>
            {/* Show label only for difficulty 1-2 */}
            {showLabels && (
              <div className="text-2xl font-black text-gray-800 capitalize">
                {question.left.size} {question.left.label}
              </div>
            )}
          </button>
        </div>

        {/* Right Side */}
        <div className="flex flex-col items-center">
          <h3 className="text-2xl font-bold mb-6 text-indigo-800 font-display">Right</h3>
          <button
            onClick={() => handleClick('right')}
            className={getButtonClass('right')}
            disabled={selectedSide !== null}
          >
            <div className="bg-sky-50 rounded-2xl p-4 mb-4 border-2 border-sky-200">
              {renderImage(question.right.src, question.right.sizeValue, question.right.label, question.right.size)}
            </div>
            {/* Show label only for difficulty 1-2 */}
            {showLabels && (
              <div className="text-2xl font-black text-gray-800 capitalize">
                {question.right.size} {question.right.label}
              </div>
            )}
          </button>
        </div>
      </div>
      
      {/* Action buttons like in mockup */}
      {!selectedSide && (
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => handleClick('left')}
            className="bg-yellow-400 hover:bg-yellow-500 text-indigo-900 font-black text-xl px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
          >
            Choose Left
          </button>
          <button
            onClick={() => handleClick('right')}
            className="bg-yellow-400 hover:bg-yellow-500 text-indigo-900 font-black text-xl px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
          >
            Choose Right
          </button>
        </div>
      )}
    </div>
  )
}
