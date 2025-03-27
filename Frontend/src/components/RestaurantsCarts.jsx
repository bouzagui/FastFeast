import { Link } from "react-router-dom";

const RestaurantCarts = ({ restaurant }) => {
  if (!restaurant) return null;

  return (
    <Link
      to={`/MenuPage/${restaurant.id}`}
      className="border rounded-lg p-4 shadow-md mb-4 hover:shadow-lg transition-shadow flex flex-col h-full"
    >
      {/* Restaurant Image */}
      <img
        src={restaurant.image_url || "/api/placeholder/400/200"}
        alt={restaurant?.name || "Restaurant"}
        className="w-full h-40 object-cover rounded-md mb-2"
      />

      {/* Restaurant Name */}
      <h2 className="text-xl font-bold mb-2">{restaurant?.name || "Restaurant Name"}</h2>

      {/* Description (will take available space) */}
      {restaurant?.description && <p className="text-gray-600 flex-grow">{restaurant.description}</p>}

      {/* Bottom Section (Location & Distance) */}
      <div className="mt-auto border-t border-gray-200">
        {restaurant?.address && (
          <div className="flex items-start space-x-2">
            <svg
              className="w-5 h-5 text-gray-500 mt-2 flex-shrink-0"
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
            <p className="text-gray-700 text-sm mt-2">{restaurant.address}</p>
          </div>
        )}

        {typeof restaurant?.distance === "number" && (
          <p className="text-sm text-gray-500 mt-1">{restaurant.distance.toFixed(1)} km away</p>
        )}
      </div>
    </Link>
  );
};

export default RestaurantCarts;
