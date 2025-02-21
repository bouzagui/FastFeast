import { useState, useEffect } from "react";
import useRestaurants from "../hooks/useRestaurants";

const useNearbyRestaurants = () => {
  const { restaurants: allRestaurants, loading: restaurantsLoading, error: restaurantsError } = useRestaurants();
  const [nearbyRestaurants, setNearbyRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (restaurantsLoading) return; // Wait until restaurants are fetched
    if (restaurantsError) {
      setError(restaurantsError);
      setLoading(false);
      return;
    }

    if (!allRestaurants || Object.keys(allRestaurants).length === 0) {
      setError("No restaurants found.");
      setLoading(false);
      return;
    }

    const storedLocation = localStorage.getItem("userlocation");
    if (!storedLocation) {
      setError("No location detected. Please enable location services.");
      setLoading(false);
      return;
    }

    const userLocation = JSON.parse(storedLocation);

    // Ensure allRestaurants is valid before using .flatMap()
    const nearbyRestaurantsList = Object.values(allRestaurants)
      .flatMap(restaurant => 
        restaurant.branches 
          ? restaurant.branches.map(branch => ({
              id: `${restaurant.id}-${branch.id}`,
              name: restaurant.name,
              description: restaurant.description,
              image_url: restaurant.image_url,
              address: branch.address,
              distance: getDistance(
                { latitude: userLocation.latitude, longitude: userLocation.longitude },
                { latitude: branch.location?.Latitude || branch.location?.latitude, 
                  longitude: branch.location?.Longitude || branch.location?.longitude }
              )
            }))
          : []
      )
      .filter(restaurant => restaurant.distance <= 10) // Filter restaurants within 10km
      .sort((a, b) => a.distance - b.distance); // Sort by distance

    console.log("Nearby Restaurants:", nearbyRestaurantsList);
    setNearbyRestaurants(nearbyRestaurantsList);
    setLoading(false);
  }, [allRestaurants, restaurantsLoading, restaurantsError]);

  return { restaurants: nearbyRestaurants, loading, error };
};

// Haversine formula for calculating distance
function getDistance(userCoords, branchCoords) {
  const R = 6371; // Earth's radius in km
  const dLat = (branchCoords.latitude - userCoords.latitude) * (Math.PI / 180);
  const dLon = (branchCoords.longitude - userCoords.longitude) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(userCoords.latitude * (Math.PI / 180)) *
    Math.cos(branchCoords.latitude * (Math.PI / 180)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default useNearbyRestaurants;
