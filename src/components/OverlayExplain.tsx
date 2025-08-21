import { QuestionItem } from '../hooks/useAdaptiveEngine'
import { useAppContext } from '../App'
import { explainSimple } from '../utils/explain.ts'

interface OverlayExplainProps {
  data: QuestionItem
  onClose: () => void
  language: string
}

export default function OverlayExplain({ data, onClose, language }: OverlayExplainProps) {
  const { strings } = useAppContext()

  const correctSide = data.left.sizeValue > data.right.sizeValue ? 'left' : 'right'
  const correctItem = correctSide === 'left' ? data.left : data.right
  
  const explanation = explainSimple(data, language)
  
  // Generate placeholder for the correct item with emphasis
  const generateEmphasizedPlaceholder = (count: number, label: string) => {
    const items = Array.from({ length: Math.min(count, 10) }, (_, i) => i)
    
    return (
      <div className="pulse-emphasis">
        <svg width="200" height="200" viewBox="0 0 200 200" className="border-4 border-success rounded-lg">
          <rect width="200" height="200" fill="#dcfce7" />
          <text x="100" y="25" textAnchor="middle" className="fill-success text-lg font-bold">
            {count} {label}
          </text>
          {items.map((_, index) => {
            const row = Math.floor(index / 5)
            const col = index % 5
            const x = 25 + col * 30
            const y = 40 + row * 30
            
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="12"
                fill="#22c55e"
                opacity="0.8"
              />
            )
          })}
          {count > 10 && (
            <text x="100" y="190" textAnchor="middle" className="fill-success text-sm font-medium">
              +{count - 10} more
            </text>
          )}
        </svg>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-primary mb-2">
              {strings.explanation || 'Let me explain! 🧠'}
            </h2>
            <p className="text-gray-600">
              {strings.learnTogether || 'Let\'s learn together'}
            </p>
          </div>

          {/* Visual Explanation */}
          <div className="flex justify-center mb-6">
            {generateEmphasizedPlaceholder(correctItem.sizeValue, correctItem.label)}
          </div>

          {/* Text Explanation */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <p className="text-lg text-center font-medium text-gray-800">
              {explanation}
            </p>
          </div>

          {/* Assignment Suggestion */}
          <div className="bg-yellow-50 rounded-lg p-4 mb-6">
            <h3 className="font-bold text-gray-800 mb-2">
              🏠 {strings.tryAtHome || 'Try at home:'}
            </h3>
            <p className="text-gray-700">
              {language === 'bn' 
                ? 'এবার আপনি চেষ্টা করুন: বাড়িতে ফল গুনুন - কতটা আপেল বনাম কলা? শিক্ষককে লিখুন বা বলুন।'
                : language === 'hi' 
                ? 'अब आप कोशिश करें: घर में फल गिनें - कितने सेब बनाम केले? शिक्षक को लिखें या बताएं।'
                : 'Now you try: count fruits at home — how many apples vs bananas? Write or tell a teacher.'
              }
            </p>
          </div>

          {/* Close Button */}
          <div className="text-center">
            <button
              onClick={onClose}
              className="btn-primary px-8"
            >
              {strings.tryAnother || 'Try Another'} ✨
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
