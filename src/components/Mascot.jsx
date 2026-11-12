import { useState } from 'react'

// src/components/Mascot.jsx
// src can be an APNG (.png) or GIF. The animation loops according to the image file.
export default function Mascot({
  message = '今日もいっしょに頑張ろう！',
  compact = false,
  src = '/mascots/pink-loop.png',
  showBubble = true,
  className = '',
}) {
  const [failedSrc, setFailedSrc] = useState(null)
  return (
    <div className={`mascot-area ${compact ? 'mascot-compact' : ''} ${className}`.trim()}>
      {showBubble && message && <div className="mascot-bubble">{message}</div>}
      {failedSrc === src ? (
        <span className="mascot-fallback" role="img" aria-label="こぶたちゃん">🐷</span>
      ) : (
        <img className="mascot-loop" src={src} alt="こぶたちゃん" onError={() => setFailedSrc(src)} />
      )}
    </div>
  )
}
