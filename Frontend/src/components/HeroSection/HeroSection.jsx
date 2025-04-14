import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, ArrowRight } from "lucide-react";
import useNearbyRestaurants from "../../hooks/useNearbyRestaurants";

export default function HeroSection() {
  const navigate = useNavigate();
  const { userAddress, loading, error } = useNearbyRestaurants();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/restaurants?search=${searchQuery}`);
  };

  return (
    <div className="relative bg-amber-400 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-400/90 to-amber-400"></div>
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=1600')] bg-cover bg-center opacity-20"></div>
      </div>

      <div className="relative max-w-7xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
          Delicious Food, <br className="hidden sm:block" />
          Delivered to Your Door
        </h1>
        <p className="text-xl md:text-2xl text-gray-800 mb-8 max-w-3xl mx-auto">
          Order from your favorite restaurants and enjoy the best meals without leaving home.
        </p>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row shadow-lg rounded-lg overflow-hidden">
            <div className="flex-1 flex items-center bg-white px-4 py-3">
              <Search className="h-5 w-5 text-gray-400 mr-3" />
              <input
                type="text"
                placeholder="Search for restaurants or cuisines..."
                className="w-full outline-none text-gray-700"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center bg-white border-t sm:border-t-0 sm:border-l border-gray-200 px-4 py-3">
              <MapPin className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-gray-700 truncate max-w-[200px]">
                {loading ? (
                  "Loading your location..."
                ) : error ? (
                  "Location error. Please enable location services."
                ) : userAddress ? (
                  userAddress.split(",")[0]
                ) : (
                  "Current Location"
                )}
              </span>
            </div>
            <button
              type="submit"
              className="bg-gray-900 text-white px-6 py-3 font-bold hover:bg-gray-800 transition-colors"
              disabled={loading || error}
            >
              Search
            </button>
          </form>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => navigate("/restaurants")}
            className="bg-gray-900 text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors flex items-center justify-center"
          >
            Browse Restaurants <ArrowRight className="ml-2 h-5 w-5" />
          </button>
          <button
            onClick={() => navigate("/aboutPage")}
            className="bg-white text-gray-900 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
          >
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
}
