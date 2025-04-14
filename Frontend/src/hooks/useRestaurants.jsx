import { useState, useEffect } from "react";
import axios from "axios";

const BASE_API_URL = "https://primeeats.live/api/restaurants/";

export default function useRestaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    // Function to get user location from localStorage or Geolocation API
    const getUserLocation = async () => {
      localStorage.removeItem("userlocation"); // Clear old location before fetching new one
    
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const location = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
            setUserLocation(location);
            localStorage.setItem("userlocation", JSON.stringify(location));
          },
          (err) => {
            console.error("Geolocation error:", err);
            setError("Location access denied. Please enable location services.");
            setLoading(false);
          }
        );
      } else {
        setError("Geolocation is not supported by this browser.");
        setLoading(false);
      }
    };
    

    getUserLocation();
  }, []);

  useEffect(() => {
    if (!userLocation) return; // Wait until we get the user's location

    const fetchRestaurants = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${BASE_API_URL}?latitude=${userLocation.latitude}&longitude=${userLocation.longitude}&radius=500`
        );
        setRestaurants(response.data || []);
        console.log("Fetched Restaurants:", response.data);
      } catch (err) {
        setError("Failed to load restaurants");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [userLocation]); // Fetch restaurants when user location updates

  return { restaurants, loading, error, userLocation };
}

