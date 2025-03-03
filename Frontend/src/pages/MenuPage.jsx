import React from "react";
import { useParams } from "react-router-dom";
import useNearbyRestaurants from "../hooks/useNearbyRestaurants";

export default function MenuPage() {
    const { id } = useParams();
    const { restaurants, loading, error } = useNearbyRestaurants();

    if (loading) return <p className="text-center text-gray-500">Loading menu...</p>;
    if (error) return <p className="text-center text-gray-500">Error loading menu: {error}</p>;

    // Find the restaurant by ID
    const restaurant = restaurants.find((rest) => rest.id === id);

    if (!restaurant) {
        return <p className="text-center text-gray-500">Restaurant not found.</p>;
    }

    // Extract menu categories from the restaurant
    const menuCategories = restaurant.menu_categories || {}; // Ensure it's an object

    return (
        <div className="rounded-b-2xl m-0 p-0">
            <h1 className="text-center text-2xl font-bold">{restaurant.name}</h1>
            <img
                src={restaurant.image_url}
                alt={restaurant.name}
                className="w-full h-40 object-cover rounded-t-2xl"
            />

            {/* Loop through menu categories if they exist */}
            {menuCategories && Object.keys(menuCategories).length > 0 ? (
                Object.entries(menuCategories).map(([categoryName, items]) => (
                    <div key={categoryName} className="mt-6">
                        <h2 className="text-center text-2xl text-gray-500">{categoryName}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-white rounded-lg shadow-md p-4 mb-4 hover:shadow-lg transition-shadow duration-300 ease-in-out"
                                >
                                    <h3 className="text-lg font-semibold">{item.name}</h3>
                                    <img src={item.image_url || "/api/placeholder/400/200"} alt={item.name || "Menu Item"} 
                                      className="w-full h-40 object-scale-down hover:object-center hover-scale-x-200 duration-100 scale-100 rounded-md mb-2"
                                    />
                                    <p className="text-gray-600">{item.description}</p>
                                    <p className="text-gray-600">Price: ${item.price.toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-center text-gray-500">No menu categories available.</p>
            )}
        </div>
    );
}
