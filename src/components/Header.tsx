import { useAppContext } from '../App'

export default function Header() {
  const { studentInfo, strings } = useAppContext()

  return (
    <header className="bg-white shadow-sm border-b-2 border-primary/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-2xl font-bold text-primary">
              📚 MiniTeach
            </div>
            <div className="text-sm text-gray-600">
              {strings.greaterLessDemo || 'Greater/Less Demo'}
            </div>
          </div>
          
          {studentInfo && (
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span className="font-medium">
                👋 {strings.hello || 'Hello'}, {studentInfo.name}!
              </span>
              <span className="bg-gray-100 px-3 py-1 rounded-full">
                {strings.class || 'Class'} {studentInfo.class}
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
