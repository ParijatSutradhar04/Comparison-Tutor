import { AdaptiveEngineState } from '../hooks/useAdaptiveEngine'
import { useAppContext } from '../App'

interface MetricsPanelProps {
  engine: AdaptiveEngineState
}

export default function MetricsPanel({ engine }: MetricsPanelProps) {
  const { strings } = useAppContext()

  const correctPercentage = engine.totalQuestions > 0 
    ? Math.round((engine.correctAnswers / engine.totalQuestions) * 100) 
    : 0

  return (
    <div className="card min-w-[250px]">
      <h3 className="text-lg font-bold text-gray-800 mb-4">
        📊 {strings.metrics || 'Metrics'}
      </h3>
      
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">{strings.mode || 'Mode'}:</span>
          <span className="font-medium capitalize">
            {engine.mode.replace('-', ' ')}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">{strings.difficulty || 'Difficulty'}:</span>
          <span className="font-medium">{engine.difficulty}/5</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">{strings.questionsAsked || 'Questions'}:</span>
          <span className="font-medium">{engine.totalQuestions}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">{strings.correctPercent || 'Correct'}:</span>
          <span className="font-medium text-success">{correctPercentage}%</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">{strings.streak || 'Streak'}:</span>
          <span className="font-medium text-primary">{engine.consecutiveCorrect}</span>
        </div>

        {/* Progress Bar */}
        <div className="pt-2">
          <div className="text-xs text-gray-600 mb-1">
            {strings.understanding || 'Understanding Progress'}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300" 
              style={{ width: `${Math.min(100, (engine.consecutiveCorrect / 3) * 100)}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  )
}
