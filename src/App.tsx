import { useState, useEffect } from 'react'
import Header from './components/Header'
import OnboardingForm from './components/OnboardingForm'
import QuestionCard from './components/QuestionCard'
import OverlayExplain from './components/OverlayExplain'
import MetricsPanel from './components/MetricsPanel'
import DemoControls from './components/DemoControls'
import { useAdaptiveEngine } from './hooks/useAdaptiveEngine'
import AppContext, { StudentInfo } from './contexts/AppContext'

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

  const contextValue = {
    studentInfo,
    setStudentInfo,
    strings
  }

  return (
    <AppContext.Provider value={contextValue}>
      {/* Sky gradient background with decorative elements */}
      <div className="min-h-screen bg-gradient-to-b from-sky-300 via-sky-200 to-green-300 relative overflow-hidden">
        {/* Decorative clouds */}
        <div className="absolute top-10 left-10 w-16 h-10 bg-white rounded-full opacity-80 floaty"></div>
        <div className="absolute top-16 left-32 w-12 h-8 bg-white rounded-full opacity-70 floaty-delay-1"></div>
        <div className="absolute top-8 right-20 w-20 h-12 bg-white rounded-full opacity-80 floaty-delay-2"></div>
        <div className="absolute top-20 right-40 w-14 h-9 bg-white rounded-full opacity-60 floaty-delay-half"></div>
        
        {/* Sun */}
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
          <div className="w-16 h-16 bg-yellow-300 rounded-full shadow-lg animate-pulse"></div>
          <div className="absolute inset-0 w-16 h-16 bg-yellow-200 rounded-full animate-ping opacity-20"></div>
        </div>
        
        {/* Bottom grass/ground decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-green-400 to-green-300"></div>
        <div className="absolute bottom-8 left-10 w-8 h-12 bg-green-600 rounded-t-full opacity-60"></div>
        <div className="absolute bottom-6 left-16 w-6 h-8 bg-green-600 rounded-t-full opacity-40"></div>
        <div className="absolute bottom-10 right-20 w-10 h-14 bg-green-600 rounded-t-full opacity-50"></div>
        <div className="absolute bottom-4 right-32 w-7 h-10 bg-green-600 rounded-t-full opacity-30"></div>
        
        {/* Cute teacher character - positioned like in mockup */}
        {studentInfo && (
          <div className="fixed bottom-0 right-8 z-20">
            {/* Teacher character - we'll use emoji/text for now, but this could be an image */}
            <div className="bg-white rounded-full p-4 shadow-2xl border-4 border-indigo-200 mb-4 hover:scale-105 transition-transform duration-300">
              <div className="text-4xl">👨‍🏫</div>
            </div>
            {/* Pointer stick - simple version */}
            <div className="absolute top-12 left-12 w-16 h-1 bg-amber-600 rotate-45 origin-left"></div>
          </div>
        )}
        
        <Header />
        
        <div className="container mx-auto px-4 py-8 max-w-6xl relative z-10">
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
