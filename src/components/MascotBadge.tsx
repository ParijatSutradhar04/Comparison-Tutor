interface MascotBadgeProps {
  className?: string
}

export default function MascotBadge({ className = '' }: MascotBadgeProps) {
  return (
    <div className={`relative ${className}`}>
      <div className="w-16 h-16 bg-gradient-to-br from-kids-amber to-kids-lime rounded-full shadow-lg border-4 border-white flex items-center justify-center floaty">
        <img 
          src="/assets/stickers/smile.svg" 
          alt="Friendly mascot" 
          className="w-10 h-10"
        />
      </div>
      {/* Sparkle decorations */}
      <div className="absolute -top-1 -right-1 w-4 h-4">
        <img src="/assets/stickers/star-1.svg" alt="" aria-hidden="true" className="w-full h-full floaty" style={{animationDelay: '1s'}} />
      </div>
      <div className="absolute -bottom-1 -left-1 w-3 h-3">
        <img src="/assets/stickers/star-2.svg" alt="" aria-hidden="true" className="w-full h-full floaty" style={{animationDelay: '2.5s'}} />
      </div>
    </div>
  )
}
