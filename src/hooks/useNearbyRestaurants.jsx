import { useEffect, useState } from "react";
import useRestaurants from "./useRestaurants";

export default function useNearbyRestaurants () {
  const { restaurants: RestaurantsData, loading: restaurantsLoading, error: restaurantsError } = useRestaurants();
  const [nearbyRestaurants, setNearbyRestaurants] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userAddress, setUserAddress] = useState("");

  useEffect(() => {
    if (restaurantsLoading) return; // Wait until restaurants are fetched
    if (restaurantsError) {
      setError(restaurantsError);
      setLoading(false);
      return;
    }

    if (!RestaurantsData || Object.keys(RestaurantsData).length === 0) {
      setError("No restaurants found.");
      setLoading(false);
      return;
    }
    console.log("all Restaurants data", RestaurantsData);

    const storedLocation = localStorage.getItem("userlocation");
    if (!storedLocation) {
      setError("No location detected. Please enable location services.");
      setLoading(false);
      return;
    }

    console.log("Stored location:", storedLocation);

    const parsedLocation = JSON.parse(storedLocation);
    setUserLocation(parsedLocation);
    getAddressFromCoords(parsedLocation.latitude, parsedLocation.longitude).then(setUserAddress);

    const RestaurantsDataList = [
      ...RestaurantsData.restaurants.map(restaurant => ({
        ...restaurant,
        isChin: false
      })),
      ...(RestaurantsData.chain_restaurants || []).map(restaurant => ({
        ...restaurant,
        isChin: true
      }))
    ];
    const nearbyRestaurantsList = Object.values(RestaurantsDataList)
    .map(restaurant => {
      // For restaurants that don't have branches structure
      if (!restaurant.branches && restaurant.latitude && restaurant.longitude) {
        const distance = getDistance(
          { latitude: parsedLocation.latitude, longitude: parsedLocation.longitude },
          { latitude: restaurant.latitude, longitude: restaurant.longitude }
        );

        return {
          ...restaurant,
          distance
        };
      }
      
      // For restaurants with branches structure (from the old format)
      if (restaurant.branches && restaurant.branches.length > 0) {
        const nearestBranch = restaurant.branches.reduce((closest, branch) => {
          const branchDistance = getDistance(
            { latitude: parsedLocation.latitude, longitude: parsedLocation.longitude },
            {
              latitude: branch.location?.Latitude || branch.location?.latitude,
              longitude: branch.location?.Longitude || branch.location?.longitude
            }
          );

          if (!closest || branchDistance < closest.distance) {
            return {
              ...restaurant,
              id: `${restaurant.id}-${branch.id}`,
              name: restaurant.name,
              description: restaurant.description,
              image_url: restaurant.image_url,
              address: branch.address,
              distance: branchDistance
            };
          }

          return closest;
        }, null);

        return nearestBranch;
      }

      return null;
    })
      .filter(Boolean) // Remove null values
      .filter(restaurant => restaurant.distance <= 10) // Keep only within 10km
      .sort((a, b) => a.distance - b.distance); // Sort by distance

    setNearbyRestaurants(nearbyRestaurantsList);
    setLoading(false);
  }, [restaurantsLoading, restaurantsError, RestaurantsData]);

  // console.log("resto", RestaurantsData);

  const getMenuCategories = RestaurantsData?.restaurants
  ? RestaurantsData.restaurants.flatMap(restaurant => restaurant.menu["categories"] || [])
  : [];

  console.log("getMenuCategories", getMenuCategories);
  console.log("userLocation", userLocation);

  return { location: userLocation, restaurants: nearbyRestaurants, loading, error, userAddress };
};


const getAddressFromCoords = async (latitude, longitude) => {
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
    const data = await response.json();
    
    if (data.display_name) {
      return data.display_name; // Full address
    } else {
      return "Address not found";
    }
  } catch (error) {
    console.error("Error fetching address:", error);
    return "Error fetching address";
  }
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
