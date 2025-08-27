import { useState } from 'react'
import { StudentInfo } from '../contexts/AppContext'
import StickerWall from './StickerWall'
import MascotBadge from './MascotBadge'

interface OnboardingFormProps {
  onComplete: (info: StudentInfo) => void
}

export default function OnboardingForm({ onComplete }: OnboardingFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    class: 3,
    nativeLanguage: 'en',
    location: 'West Bengal'
  })
  
  const [funMode, setFunMode] = useState(true)

  const languages = [
    { code: 'en', name: 'English', icon: '🇺🇸' },
    { code: 'hi', name: 'हिंदी (Hindi)', icon: '🇮🇳' },
    { code: 'bn', name: 'বাংলা (Bengali)', icon: '🇧🇩' }
  ]

  const locations = [
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chhattisgarh',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Madhya Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Telangana',
    'Tripura',
    'Uttar Pradesh',
    'Uttarakhand',
    'West Bengal',
    'Delhi',
    'Jammu and Kashmir',
    'Ladakh'
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name.trim()) {
      // Save fun mode to localStorage
      localStorage.setItem('miniteach-fun-mode', JSON.stringify(funMode))
      onComplete({ ...formData, funMode })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8 bg-gradient-to-br from-kids-sky/60 via-white to-kids-purple/40">
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-8 items-stretch">
        
        {/* Left Hero Section */}
        <div className="relative order-2 md:order-1">
          <StickerWall density="med" className="z-0" />
          <div className="relative z-10 h-full flex flex-col justify-center p-6 md:p-8">
            <div className="text-center md:text-left space-y-4">
              <h1 className="font-display text-4xl md:text-6xl font-bold text-primary leading-tight">
                Let's Play With More & Less!
              </h1>
              <p className="text-lg md:text-xl text-gray-700 font-medium">
                We'll look, compare, and celebrate your wins �
              </p>
              <p className="text-sm text-gray-500">
                Made for young learners to build confident comparison skills
              </p>
            </div>
            
            {/* Floating decorative stickers */}
            <div className="hidden md:block">
              <img 
                src="/assets/stickers/rocket.svg" 
                alt="" 
                aria-hidden="true"
                className="absolute top-20 right-20 w-12 h-12 floaty opacity-60"
                style={{animationDelay: '0.5s'}}
              />
              <img 
                src="/assets/stickers/rainbow.svg" 
                alt="" 
                aria-hidden="true"
                className="absolute bottom-20 left-10 w-16 h-16 floaty opacity-50"
                style={{animationDelay: '2s'}}
              />
              <img 
                src="/assets/stickers/cat.svg" 
                alt="" 
                aria-hidden="true"
                className="absolute top-1/3 left-20 w-10 h-10 floaty opacity-70"
                style={{animationDelay: '3.5s'}}
              />
            </div>
          </div>
        </div>

        {/* Right Form Section */}
        <div className="relative order-1 md:order-2">
          <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-6 md:p-8 border border-white/20">
            
            {/* Mascot Badge */}
            <MascotBadge className="absolute -top-8 left-6" />
            
            <div className="pt-4">
              <div className="text-center mb-6">
                <h2 className="font-display text-2xl font-bold text-gray-800 mb-2">
                  Ready to Start?
                </h2>
                <p className="text-gray-600">
                  Tell us a bit about yourself first!
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <span>👤</span> What's your name? <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl focus:border-primary focus:outline-none text-lg transition-colors"
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <span>🎓</span> Which class are you in?
                  </label>
                  <select
                    value={formData.class}
                    onChange={(e) => setFormData({ ...formData, class: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl focus:border-primary focus:outline-none text-lg transition-colors"
                    aria-label="Select your class level"
                  >
                    {[1, 2, 3, 4, 5].map(cls => (
                      <option key={cls} value={cls}>Class {cls}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <span>🌍</span> What language do you speak?
                  </label>
                  <select
                    value={formData.nativeLanguage}
                    onChange={(e) => setFormData({ ...formData, nativeLanguage: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl focus:border-primary focus:outline-none text-lg transition-colors"
                    aria-label="Select your native language"
                  >
                    {languages.map(lang => (
                      <option key={lang.code} value={lang.code}>
                        {lang.icon} {lang.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <span>📍</span> Where are you from?
                  </label>
                  <select
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl focus:border-primary focus:outline-none text-lg transition-colors"
                    aria-label="Select your location"
                  >
                    {locations.map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>

                {/* Fun Mode Toggle */}
                <div className="bg-kids-amber/10 rounded-2xl p-4 border-2 border-kids-amber/20">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={funMode}
                        onChange={(e) => setFunMode(e.target.checked)}
                        className="sr-only"
                      />
                      <div className={`w-12 h-6 rounded-full transition-colors ${funMode ? 'bg-kids-lime' : 'bg-gray-300'}`}>
                        <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${funMode ? 'translate-x-7' : 'translate-x-0.5'} mt-0.5`}></div>
                      </div>
                    </div>
                    <div>
                      <span className="font-bold text-gray-800 flex items-center gap-1">
                        🎉 Fun Mode
                      </span>
                      <p className="text-xs text-gray-600">
                        Enable celebrations, animations, and stickers!
                      </p>
                    </div>
                  </label>
                </div>

                <button
                  type="submit"
                  className="btn-primary w-full mt-8 text-xl py-4 font-display font-bold"
                  disabled={!formData.name.trim()}
                >
                  🚀 Start Demo
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
