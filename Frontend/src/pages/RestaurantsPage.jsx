// src/pages/Restaurants.jsx
import React from 'react';
import useNearbyRestaurants from '../services/useNearbyRestaurants';
import RestaurantCards from '../components/RestaurantsCarts';
import Navbar from '../components/Navbar/Navbar';


const Restaurants = () => {
  const { restaurants, loading, error } = useNearbyRestaurants();
  const restaurantArray = Object.values(restaurants);

  console.log("this is restaurants:", restaurantArray);

  if (loading) return <p className='flex justify-center items-center'>Loading restaurants...</p>;
  if (!Array.isArray(restaurantArray)) return <p>Error: Data is not an array</p>;
  if (!restaurants || restaurantArray.length === 0) return <p>No nearby restaurants found.</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className='m-0 p-0'>
      <Navbar />
      <h1 className="text-2xl font-bold mb-4 flex justify-center">Nearby Restaurants</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {restaurantArray.map((restaurant) => (
          <RestaurantCards key={restaurant.id} restaurant={restaurant} />
        ))}
      </div>
    </div>
  );
};

export default Restaurants;
