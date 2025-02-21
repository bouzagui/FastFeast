import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/restaurants";

export default function useRestaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get(API_URL);
        setRestaurants(response.data || []); // ✅ Ensure data exists
      } catch (err) {
        setError("Failed to load restaurants");
      } finally {
        setLoading(false);
      }
    };
    // googleMaps();
    fetchRestaurants();
  }, []);

  return { restaurants, loading, error };
}
