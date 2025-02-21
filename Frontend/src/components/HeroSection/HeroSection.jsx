import React, { useState } from "react";
import LocationDetector from "../LocationDetector";
import { useNavigate } from "react-router-dom";

export default function HeroSection() {
  const navigate = useNavigate();
  const [location, setLocation] = useState(() => {
    const storedLocation = localStorage.getItem("location");
    return storedLocation ? JSON.parse(storedLocation) : null;
  });
  console.log("this is location:", location);

  const handleLocationChange = (newLocation) => {
    setLocation(newLocation);
    localStorage.setItem("userlocation", JSON.stringify(newLocation));
    navigate("/restaurants")
  };

  return (
    <div className="bg-linear-to-r/hsl from-indigo-500 to-teal-400 m-0 p-0">
      <main>
        <div className="w-full h-28 flex justify-center items-end">
          <input
            name="myInput"
            className="bg-white pl-2 w-full max-w-md py-2 border-3 hover:border-2 border-amber-400 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-400"
            placeholder="Add your address"
            value={location ? `Lat: ${location.latitude}, Lng: ${location.longitude}` : ""}
            // readOnly
          />
        </div>
        {/* Use LocationDetector at the bottom */}
        <div className="w-full flex justify-center mt-4">
          <LocationDetector onLocationDetect={handleLocationChange} value={location ? `Lat: ${location?.latitude}, Lng: ${location?.longitude}` : ""}/>
        </div>
      </main>
    </div>
  );
}
