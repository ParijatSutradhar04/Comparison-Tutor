import { useState } from 'react'
import { StudentInfo } from '../App'

interface OnboardingFormProps {
  onComplete: (info: StudentInfo) => void
}

export default function OnboardingForm({ onComplete }: OnboardingFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    class: 3,
    nativeLanguage: 'en',
    location: 'India'
  })

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिंदी (Hindi)' },
    { code: 'bn', name: 'বাংলা (Bengali)' }
  ]

  const locations = [
    'India',
    'United States',
    'United Kingdom',
    'Canada',
    'Australia'
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name.trim()) {
      onComplete(formData)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="card">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-primary mb-2">
            Welcome to MiniTeach! 🎓
          </h1>
          <p className="text-gray-600">
            Let's learn about greater than and less than together!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              What's your name?
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none text-lg"
              placeholder="Enter your name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Which class are you in?
            </label>
            <select
              value={formData.class}
              onChange={(e) => setFormData({ ...formData, class: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none text-lg"
              aria-label="Select your class level"
            >
              {[1, 2, 3, 4, 5].map(cls => (
                <option key={cls} value={cls}>Class {cls}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              What language do you speak?
            </label>
            <select
              value={formData.nativeLanguage}
              onChange={(e) => setFormData({ ...formData, nativeLanguage: e.target.value })}
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none text-lg"
              aria-label="Select your native language"
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code}>{lang.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Where are you from?
            </label>
            <select
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none text-lg"
              aria-label="Select your location"
            >
              {locations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="btn-primary w-full mt-6"
            disabled={!formData.name.trim()}
          >
            🚀 Start Demo
          </button>
        </form>
      </div>
    </div>
  )
}
