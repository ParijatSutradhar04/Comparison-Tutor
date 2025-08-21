import { useState, useEffect, createContext, useContext } from 'react'
import Header from './components/Header'
import OnboardingForm from './components/OnboardingForm'
import QuestionCard from './components/QuestionCard'
import OverlayExplain from './components/OverlayExplain'
import MetricsPanel from './components/MetricsPanel'
import DemoControls from './components/DemoControls'
import { useAdaptiveEngine } from './hooks/useAdaptiveEngine'

export interface StudentInfo {
  name: string
  class: number
  nativeLanguage: string
  location: string
  funMode?: boolean
}

interface AppContextType {
  studentInfo: StudentInfo | null
  setStudentInfo: (info: StudentInfo) => void
  strings: Record<string, string>
}

const AppContext = createContext<AppContextType | null>(null)

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) throw new Error('useAppContext must be used within AppProvider')
  return context
}

function App() {
  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null)
  const [strings, setStrings] = useState<Record<string, string>>({})
  const [showDemoControls, setShowDemoControls] = useState(false)

  const engine = useAdaptiveEngine()

  useEffect(() => {
    // Clear any previous student info to always start fresh
    localStorage.removeItem('studentInfo')
    // Always load English strings initially
    loadStrings('en')
  }, [])

  const loadStrings = async (language: string) => {
    try {
      const response = await fetch(`/src/i18n/${language}.json`)
      const data = await response.json()
      setStrings(data)
    } catch (error) {
      console.error('Failed to load strings:', error)
      // Fallback to English
      if (language !== 'en') {
        loadStrings('en')
      }
    }
  }

  const handleOnboardingComplete = (info: StudentInfo) => {
    setStudentInfo(info)
    localStorage.setItem('studentInfo', JSON.stringify(info))
    loadStrings(info.nativeLanguage)
    engine.reset()
  }

  const contextValue: AppContextType = {
    studentInfo,
    setStudentInfo,
    strings
  }

  return (
    <AppContext.Provider value={contextValue}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <Header />
        
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {!studentInfo ? (
            <OnboardingForm onComplete={handleOnboardingComplete} />
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <QuestionCard
                    engine={engine}
                    studentInfo={studentInfo}
                  />
                </div>
                <div className="ml-6 space-y-4">
                  <MetricsPanel engine={engine} />
                  <button
                    onClick={() => setShowDemoControls(!showDemoControls)}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700 transition-colors"
                  >
                    {showDemoControls ? 'Hide' : 'Show'} Demo Controls
                  </button>
                  {showDemoControls && <DemoControls engine={engine} />}
                </div>
              </div>
            </div>
          )}
        </div>

        {engine.showOverlay && engine.overlayData && (
          <OverlayExplain
            data={engine.overlayData}
            onClose={engine.closeOverlay}
            language={studentInfo?.nativeLanguage || 'en'}
          />
        )}
      </div>
    </AppContext.Provider>
  )
}

export default App
