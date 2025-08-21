import { useAppContext } from '../contexts/AppContext'

export default function Header() {
  const { studentInfo, strings } = useAppContext()

  return (
    <header className="relative z-10 bg-white/90 backdrop-blur-sm shadow-lg border-b-4 border-indigo-200">
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="text-4xl font-black font-display text-indigo-800">
              🌟 MiniTeach
            </div>
            <div className="text-lg text-indigo-600 font-semibold">
              {strings.funLearning || 'Fun Learning with Numbers!'}
            </div>
          </div>
          
          {studentInfo && (
            <div className="flex items-center space-x-6">
              <span className="text-xl font-bold text-indigo-700">
                🎉 {strings.hello || 'Hello'}, {studentInfo.name}!
              </span>
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-indigo-900 px-4 py-2 rounded-full font-black text-lg shadow-lg">
                {strings.class || 'Class'} {studentInfo.class}
              </span>
              <span className="animate-pulse text-2xl">
                ⭐
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
