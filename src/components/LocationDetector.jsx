"use client"

import { useState } from "react"
import { MapPin, Loader } from "lucide-react"

const LocationDetector = ({ onLocationDetect }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const getLocation = () => {
    setIsLoading(true)
    setError(null)

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          onLocationDetect({ latitude, longitude })
          setIsLoading(false)
        },
        (error) => {
          console.error("Geolocation error:", error)
          setError(
            error.code === 1
              ? "Location access denied. Please enable location services."
              : "Could not get your location. Please try again.",
          )
          setIsLoading(false)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        },
      )
    } else {
      setError("Geolocation is not supported by this browser.")
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      <button
        onClick={getLocation}
        disabled={isLoading}
        className={`
          group
          flex
          items-center
          justify-center
          gap-2
          px-6
          py-2.5
          rounded-full
          ${isLoading ? "bg-amber-100 cursor-wait" : "bg-amber-100 hover:bg-amber-200"}
          text-amber-800
          font-medium
          transition-all
          duration-300
          focus:outline-none
          focus:ring-2
          focus:ring-amber-400
          focus:ring-offset-2
          w-auto
          text-sm
          shadow-sm
          border border-amber-200
        `}
      >
        {isLoading ? (
          <Loader className="h-4 w-4 animate-spin text-amber-600" />
        ) : (
          <MapPin className="h-4 w-4 text-amber-600 group-hover:text-amber-700" />
        )}
        {isLoading ? "Getting location..." : "Use your current location"}
      </button>

      {error && (
        <div className="mt-3 px-4 py-2 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm font-medium text-center">{error}</p>
        </div>
      )}
    </div>
  )
}

export default LocationDetector

