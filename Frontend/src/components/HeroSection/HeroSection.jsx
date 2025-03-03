import React, { useState, useEffect } from "react";
import LocationDetector from "../LocationDetector";
import { useNavigate } from "react-router-dom";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export default function HeroSection() {
  const navigate = useNavigate();
  const [location, setLocation] = useState(() => {
    const storedLocation = localStorage.getItem("userlocation");
    return storedLocation ? JSON.parse(storedLocation) : null;
  });

  const [address, setAddress] = useState("");

  useEffect(() => {
    if (location) {
      fetchAddress(location.latitude, location.longitude);
    }
  }, [location]);

  const fetchAddress = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();
      if (data.status === "OK" && data.results.length > 0) {
        setAddress(data.results[0].formatted_address);
      } else {
        setAddress("Address not found");
      }
    } catch (error) {
      console.error("Error fetching address:", error);
      setAddress("Error fetching address");
    }
  };

  const handleLocationChange = (newLocation) => {
    setLocation(newLocation);
    localStorage.setItem("userlocation", JSON.stringify(newLocation));
    fetchAddress(newLocation.latitude, newLocation.longitude); // Fetch address when location updates
    navigate("/restaurants");
  };

  return (
    <div className="bg-gradient-to-r from-indigo-500 to-teal-400 m-0 p-0">
      <main>
        <div className="w-full h-28 flex justify-center items-end">
          <input
            name="myInput"
            className="bg-white pl-2 w-full max-w-md py-2 border-3 hover:border-2 border-amber-400 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-400"
            placeholder="Add your address"
            value={address || "Fetching address..."} // Show formatted address
            readOnly
          />
        </div>

        <div className="w-full flex justify-center mt-4">
          <LocationDetector onLocationDetect={handleLocationChange} />
        </div>
      </main>
    </div>
  );
}
