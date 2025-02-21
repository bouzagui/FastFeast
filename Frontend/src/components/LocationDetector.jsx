import React, { useState } from "react";

const LocationDetector = ({ onLocationDetect }) => {
  const [error, setError] = useState(null);

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          onLocationDetect({ latitude, longitude });
          localStorage.setItem("userlocation", JSON.stringify({ latitude, longitude })); 
          setError(null);
        },
        (error) => {
          setError("Location access denied!");
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };

  return (
    <>
      <button
        onClick={getLocation}
        className={`
            flex
            items-center
            justify-center
            gap-2
            px-1
            sm:py-2
            rounded-full
            bg-yellow-400
            text-black
            font-semibold
            transition-all
            duration-300
            hover:bg-yellow-500
            focus:outline-none
            focus:ring-yellow-400/50
          `}
      >
        Use your current location
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </>
  );
};

export default LocationDetector;
