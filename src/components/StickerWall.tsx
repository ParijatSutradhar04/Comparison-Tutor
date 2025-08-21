interface StickerWallProps {
  density?: 'low' | 'med' | 'high'
  className?: string
}

const stickerPaths = [
  '/assets/stickers/star-1.svg',
  '/assets/stickers/star-2.svg',
  '/assets/stickers/rocket.svg',
  '/assets/stickers/cat.svg',
  '/assets/stickers/dog.svg',
  '/assets/stickers/rainbow.svg',
  '/assets/stickers/smile.svg'
]

export default function StickerWall({ density = 'med', className = '' }: StickerWallProps) {
  const stickerCount = density === 'low' ? 8 : density === 'med' ? 12 : 20
  
  // Generate random positions for stickers
  const stickers = Array.from({ length: stickerCount }, (_, i) => ({
    id: i,
    path: stickerPaths[i % stickerPaths.length],
    left: Math.random() * 90 + 5, // 5-95%
    top: Math.random() * 80 + 10, // 10-90%
    rotation: Math.random() * 360,
    scale: 0.6 + Math.random() * 0.8, // 0.6-1.4
    animationDelay: Math.random() * 5, // 0-5s delay
    opacity: 0.3 + Math.random() * 0.4 // 0.3-0.7 opacity
  }))

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {stickers.map((sticker) => (
        <img
          key={sticker.id}
          src={sticker.path}
          alt=""
          aria-hidden="true"
          className="absolute w-8 h-8 floaty"
          style={{
            left: `${sticker.left}%`,
            top: `${sticker.top}%`,
            transform: `rotate(${sticker.rotation}deg) scale(${sticker.scale})`,
            animationDelay: `${sticker.animationDelay}s`,
            opacity: sticker.opacity
          }}
        />
      ))}
      {/* Scattered dots for extra magic */}
      <div className="absolute inset-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={`dot-${i}`}
            className="absolute w-1 h-1 bg-kids-purple rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
