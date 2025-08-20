import { AdaptiveEngineState } from '../hooks/useAdaptiveEngine'
import { useAppContext } from '../App'

interface DemoControlsProps {
  engine: AdaptiveEngineState & {
    forceDifficulty: (difficulty: number) => void
    switchToWordMode: () => void
    reset: () => void
    runDemoSequence: (studentClass: number, location: string) => void
  }
}

export default function DemoControls({ engine }: DemoControlsProps) {
  const { strings, studentInfo } = useAppContext()

  const handleDemoSequence = () => {
    if (studentInfo) {
      engine.runDemoSequence(studentInfo.class, studentInfo.location)
    }
  }

  return (
    <div className="card min-w-[250px]">
      <h3 className="text-lg font-bold text-gray-800 mb-4">
        🎮 {strings.demoControls || 'Demo Controls'}
      </h3>
      
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {strings.forceDifficulty || 'Force Difficulty'}
          </label>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map(level => (
              <button
                key={level}
                onClick={() => engine.forceDifficulty(level)}
                className={`px-2 py-1 rounded text-sm font-medium ${
                  engine.difficulty === level
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={engine.switchToWordMode}
          className="w-full bg-purple-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-purple-700 transition-colors"
          disabled={engine.mode === 'word-mode'}
        >
          {strings.switchToWordMode || 'Switch to Word Mode'}
        </button>

        <button
          onClick={engine.reset}
          className="w-full bg-gray-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-gray-700 transition-colors"
        >
          {strings.resetProgress || 'Reset Progress'}
        </button>

        <hr className="my-4" />

        <div>
          <h4 className="font-medium text-gray-800 mb-2">
            🎪 {strings.demoSequence || 'Demo Sequence'}
          </h4>
          <p className="text-xs text-gray-600 mb-3">
            {strings.demoSequenceDesc || 'Automated demo for presentations'}
          </p>
          <button
            onClick={handleDemoSequence}
            className="w-full bg-yellow-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-yellow-700 transition-colors"
          >
            {strings.runDemo || 'Run Demo Sequence'}
          </button>
        </div>
      </div>
    </div>
  )
}
