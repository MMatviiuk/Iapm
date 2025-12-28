import React, { useState } from 'react'

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=='

// SVG icon for pills/medication
const PILL_ICON_SRC = 
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHZpZXdCb3g9IjAgMCA4OCA4OCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODgiIGhlaWdodD0iODgiIGZpbGw9IiNlNWU3ZWIiLz48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0NCw0NCkiPjxjaXJjbGUgcj0iMjQiIGZpbGw9IiNmZmYiLz48cGF0aCBkPSJNLTE2LC0xNiBMMTYsMTYgTS0xNiwxNiBMMTYsLTE2IiBzdHJva2U9IiMyMTk2RjMiIHN0cm9rZS13aWR0aD0iMyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PGNpcmNsZSByPSI1IiBjeD0iLTgiIGN5PSItOCIgZmlsbD0iIzIxOTZGMyIvPjxjaXJjbGUgcj0iNSIgY3g9IjgiIGN5PSI4IiBmaWxsPSIjMjE5NkYzIi8+PC9nPjwvc3ZnPg=='

export function ImageWithFallback(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [didError, setDidError] = useState(false)

  const handleError = () => {
    setDidError(true)
  }

  const { src, alt, style, className, ...rest } = props

  // If no src or error, show fallback
  if (!src || didError) {
    return (
      <div
        className={`inline-block bg-gray-100 text-center align-middle ${className ?? ''}`}
        style={style}
      >
        <div className="flex items-center justify-center w-full h-full">
          <img src={PILL_ICON_SRC} alt={alt || "Medication"} {...rest} data-original-url={src} />
        </div>
      </div>
    )
  }

  return (
    <img src={src} alt={alt} className={className} style={style} {...rest} onError={handleError} />
  )
}
