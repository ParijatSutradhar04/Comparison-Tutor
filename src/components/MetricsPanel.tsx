import { AdaptiveEngineState } from '../hooks/useAdaptiveEngine'
import { useAppContext } from '../contexts/AppContext'

interface MetricsPanelProps {
  engine: AdaptiveEngineState
}

export default function MetricsPanel({ engine }: MetricsPanelProps) {
  const { strings } = useAppContext()

  const correctPercentage = engine.totalQuestions > 0 
    ? Math.round((engine.correctAnswers / engine.totalQuestions) * 100) 
    : 0

  return (
    <div className="bg-white rounded-3xl shadow-2xl border-4 border-pink-300 p-6 min-w-[280px] relative overflow-hidden">
      {/* Decorative corner stars */}
      <div className="absolute top-2 left-2 text-yellow-400">⭐</div>
      <div className="absolute top-2 right-2 text-pink-400">💖</div>
      <div className="absolute bottom-2 left-2 text-green-400">🌟</div>
      <div className="absolute bottom-2 right-2 text-blue-400">🎯</div>
      
      <h3 className="text-2xl font-black text-pink-600 mb-6 font-display text-center">
        📊 {strings.metrics || 'Metrics'}
      </h3>
      
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-3">
          <div className="flex justify-between items-center">
            <span className="text-purple-700 font-semibold">{strings.mode || 'Mode'}:</span>
            <span className="font-black text-purple-800 capitalize">
              {engine.difficulty <= 3 ? 'Image Mode' : 'Word Mode'}
            </span>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-100 to-sky-100 rounded-2xl p-3">
          <div className="flex justify-between items-center">
            <span className="text-blue-700 font-semibold">{strings.difficulty || 'Difficulty'}:</span>
            <span className="font-black text-blue-800">{engine.difficulty}/5</span>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl p-3">
          <div className="flex justify-between items-center">
            <span className="text-green-700 font-semibold">{strings.questionsAsked || 'Questions Asked'}:</span>
            <span className="font-black text-green-800">{engine.totalQuestions}</span>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-emerald-100 to-green-100 rounded-2xl p-3">
          <div className="flex justify-between items-center">
            <span className="text-emerald-700 font-semibold">{strings.correctPercent || 'Correct %'}:</span>
            <span className="font-black text-emerald-800 text-lg">{correctPercentage}%</span>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-100 to-yellow-100 rounded-2xl p-3">
          <div className="flex justify-between items-center">
            <span className="text-orange-700 font-semibold">{strings.streak || 'Streak'}:</span>
            <span className="font-black text-orange-800 text-lg">{engine.consecutiveCorrect}</span>
          </div>
        </div>

        {/* Fun Progress Bar */}
        <div className="pt-2">
          <div className="text-sm font-bold text-indigo-700 mb-2 text-center">
            🎓 {strings.understanding || 'Understanding Progress'}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 border-2 border-indigo-300">
            <div 
              className={`bg-gradient-to-r from-indigo-400 to-purple-500 h-full rounded-full transition-all duration-500 relative overflow-hidden ${
                engine.difficulty === 5 ? 'w-4/5' :
                engine.difficulty === 4 ? 'w-3/5' :
                engine.difficulty === 3 ? 'w-2/5' :
                engine.difficulty === 2 ? 'w-1/5' :
                engine.difficulty === 1 ? 'w-0'   :
                'w-full'
              }`}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
