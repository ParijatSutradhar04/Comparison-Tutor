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
  const { strings, studentInfo, setStudentInfo } = useAppContext()

  const handleDemoSequence = () => {
    if (studentInfo) {
      engine.runDemoSequence(studentInfo.class, studentInfo.location)
    }
  }

  const toggleFunMode = () => {
    if (studentInfo) {
      const newFunMode = !studentInfo.funMode
      const updatedInfo = { ...studentInfo, funMode: newFunMode }
      setStudentInfo(updatedInfo)
      localStorage.setItem('miniteach-fun-mode', JSON.stringify(newFunMode))
      localStorage.setItem('studentInfo', JSON.stringify(updatedInfo))
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

        {/* Fun Mode Toggle */}
        <div className="bg-kids-amber/10 rounded-lg p-3 border border-kids-amber/20">
          <label className="flex items-center gap-3 cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                checked={studentInfo?.funMode ?? true}
                onChange={toggleFunMode}
                className="sr-only"
              />
              <div className={`w-10 h-5 rounded-full transition-colors ${studentInfo?.funMode ? 'bg-kids-lime' : 'bg-gray-300'}`}>
                <div className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform ${studentInfo?.funMode ? 'translate-x-6' : 'translate-x-0.5'} mt-0.5`}></div>
              </div>
            </div>
            <div>
              <span className="font-bold text-gray-800 text-sm flex items-center gap-1">
                🎉 Fun Mode
              </span>
              <p className="text-xs text-gray-600">
                Confetti on correct answers
              </p>
            </div>
          </label>
        </div>

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
