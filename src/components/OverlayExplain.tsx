import { QuestionItem } from '../hooks/useAdaptiveEngine'
import { useAppContext } from '../contexts/AppContext'
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
  
  // Function to render object image with fallback
  const renderObjectImage = (object: typeof data.left | typeof data.right, isCorrect: boolean) => {
    // In word-mode, use the image field; in image-mode, use src field
    const imageSrc = object.image || object.src
    const objectName = object.word || object.label
    
    const cardClasses = `
      bg-white rounded-xl p-4 shadow-lg transition-all duration-300 min-h-[200px] w-48
      ${isCorrect ? 'ring-4 ring-green-400 animate-pulse' : 'ring-2 ring-gray-200'}
    `.trim()
    
    return (
      <div className={cardClasses}>
        <div className="flex flex-col items-center space-y-3">
          {/* Image container */}
          <div className="w-24 h-24 flex items-center justify-center">
            {imageSrc ? (
              <img
                src={imageSrc}
                alt={`${object.size} ${objectName}`}
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  // Replace with text fallback on error
                  const target = e.target as HTMLImageElement
                  const parent = target.parentElement
                  if (parent) {
                    parent.innerHTML = `
                      <div class="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 text-sm text-center">
                        ${object.size}<br/>${objectName}
                      </div>
                    `
                  }
                }}
              />
            ) : (
              <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 text-sm text-center">
                {object.size}<br/>{objectName}
              </div>
            )}
          </div>
          
          {/* Object info */}
          <div className="text-center">
            <div className="text-lg font-bold text-gray-800 capitalize">
              {objectName}
            </div>
            <div className="text-sm text-gray-600">
              ({object.size})
            </div>
            {isCorrect && (
              <div className="text-green-600 font-bold text-sm mt-2 px-2 py-1 bg-green-100 rounded-full">
                ✨ LARGER ✨
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }
  
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
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
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

          {/* Visual Explanation - Show images for word-mode, dots for image-mode */}
          {data.mode === 'word-mode' ? (
            <div className="mb-6">              
              {/* Images side by side for word-mode */}
              <div className="flex flex-col lg:flex-row gap-6 justify-center items-center">
                {renderObjectImage(data.left, correctSide === 'left')}
                {renderObjectImage(data.right, correctSide === 'right')}
              </div>
              <div className="text-center mt-4">
                <p className="text-sm text-gray-600">
                  ✨ The <strong>{correctItem.word || correctItem.label}</strong> is larger!
                </p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center mb-6">
              {generateEmphasizedPlaceholder(correctItem.sizeValue, correctItem.label)}
            </div>
          )}

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
