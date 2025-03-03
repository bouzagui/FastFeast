import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/restaurants";

export default function useRestaurants(id) {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get(API_URL);
        setRestaurants(response.data || []);
      } catch (err) {
        setError("Failed to load restaurants");
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  return { restaurants, loading, error };
}
