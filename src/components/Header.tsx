import { useAppContext } from '../App'

export default function Header() {
  const { studentInfo, strings } = useAppContext()
  const funMode = studentInfo?.funMode ?? false

  return (
    <header className={`shadow-sm border-b-2 ${funMode ? 'bg-gradient-to-r from-kids-pink/20 to-kids-purple/20 border-kids-purple/30' : 'bg-white border-primary/20'}`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`text-2xl font-bold ${funMode ? 'font-display text-kids-purple' : 'text-primary'}`}>
              {funMode ? '🌟 MiniTeach' : '📚 MiniTeach'}
            </div>
            <div className="text-sm text-gray-600">
              {funMode ? (strings.funLearning || 'Fun Learning with Numbers!') : (strings.greaterLessDemo || 'Greater/Less Demo')}
            </div>
          </div>
          
          {studentInfo && (
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span className="font-medium">
                {funMode ? '🎉' : '👋'} {strings.hello || 'Hello'}, {studentInfo.name}!
              </span>
              <span className={`px-3 py-1 rounded-full ${funMode ? 'bg-kids-amber/20 text-kids-purple font-medium' : 'bg-gray-100'}`}>
                {strings.class || 'Class'} {studentInfo.class}
              </span>
              {funMode && (
                <span className="animate-pulse">
                  ⭐
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
