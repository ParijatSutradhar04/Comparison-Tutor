import { createContext, useContext } from 'react'

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

export default AppContext
