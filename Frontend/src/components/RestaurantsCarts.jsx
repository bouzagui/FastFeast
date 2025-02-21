import React from "react";

const RestaurantCards = ({ restaurant }) => {
  if (!restaurant) {
    return null; // Or return a placeholder/skeleton component
  }

  return (
    <div className="border rounded-lg p-4 shadow-md mb-4 hover:shadow-lg transition-shadow">
      <img
        src={restaurant.image_url || "/api/placeholder/400/200"}
        alt={restaurant?.name || "Restaurant"}
        className="w-full h-40 object-cover rounded-md mb-3"
      />
      <h2 className="text-xl font-bold mb-2">
        {restaurant?.name || "Restaurant Name"}
      </h2>
      {restaurant?.description && (
        <p className="text-gray-600 mb-3">{restaurant.description}</p>
      )}
      {restaurant?.address && (
        <div className="flex items-start space-x-2">
          <svg
            className="w-5 h-5 text-gray-500 mt-1 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <p className="text-gray-700">{restaurant.address}</p>
        </div>
      )}
      {typeof restaurant?.distance === 'number' && (
        <p className="text-sm text-gray-500 mt-2">
          {restaurant.distance.toFixed(1)} km away
        </p>
      )}
    </div>
  );
};

export default RestaurantCards;