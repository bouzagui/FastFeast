"use client"

import { useState, useRef, useEffect } from "react"
import { useParams } from "react-router-dom"
import useNearbyRestaurants from "../hooks/useNearbyRestaurants"
import { ChevronLeft, Clock, Star, Minus, Plus, ShoppingBag } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useCart } from "../context/CartProvider"

export default function MenuPage() {
  const { id } = useParams()
  const { restaurants, loading, error } = useNearbyRestaurants()
  const [activeCategory, setActiveCategory] = useState("")
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false)
  const categoryRefs = useRef({})
  const { updateItemQuantity, calculateCart, updateMenuCategories, restaurantCarts } = useCart()

  // All state and derived values that depend on async data
  const [menuCategories, setMenuCategories] = useState({})
  const [restaurant, setRestaurant] = useState(null)
  const [cartInfo, setCartInfo] = useState({ totalItems: 0, totalPrice: 0 })

  // Track if menu categories have been updated to prevent infinite loop
  const menuCategoriesUpdatedRef = useRef(false)

  const navigate = useNavigate()

  const handleBack = () => {
    navigate("/restaurants", { replace: true })
  }

  const handleCheckout = () => {
    navigate("/checkout")
  }

  // Process menu categories from restaurant data
  const processMenuCategories = (restaurantData) => {
    console.log("Processing menu categories for:", restaurantData)

    // Check if restaurant has menu with categories array
    if (restaurantData.menu && restaurantData.menu.categories && Array.isArray(restaurantData.menu.categories)) {
      // Convert the categories array directly to an object with category names as keys
      const categories = {}

      restaurantData.menu.categories.forEach((category) => {
        categories[category.name] = category.items.map((item) => ({
          id: item.id,
          name: item.name,
          description: item.description || "",
          price: Number.parseFloat(item.price) || 0,
          image_url: item.image_url || null,
        }))
      })

      console.log("Processed categories from menu.categories:", categories)
      return categories
    }

    // Keep the rest of your fallback logic for other data structures
    const DEFAULT_CATEGORY = "Menu Items"

    // Check if the restaurant has menu items array directly
    if (restaurantData.menu_items && Array.isArray(restaurantData.menu_items)) {
      // Group menu items by category
      const categories = {}
      categories[DEFAULT_CATEGORY] = restaurantData.menu_items.map((item) => ({
        id: item.id,
        name: item.name,
        description: item.description || "",
        price: Number.parseFloat(item.price) || 0,
        image_url: item.image_url || null,
      }))

      return categories
    }

    // Check if restaurant has menu_categories array
    if (restaurantData.menu_categories && Array.isArray(restaurantData.menu_categories)) {
      // Group menu items by category
      const categories = {}

      restaurantData.menu_categories.forEach((item) => {
        const categoryName = item.category_name || DEFAULT_CATEGORY

        if (!categories[categoryName]) {
          categories[categoryName] = []
        }

        categories[categoryName].push({
          id: item.id,
          name: item.name,
          description: item.description || "",
          price: Number.parseFloat(item.price) || 0,
          image_url: item.image_url || null,
        })
      })

      return categories
    }

    // For the provided backend format (checking if there's an array in each restaurant)
    if (restaurantData.menu && Array.isArray(restaurantData.menu)) {
      const categories = {}
      categories[DEFAULT_CATEGORY] = restaurantData.menu.map((item) => ({
        id: item.id,
        name: item.name,
        description: item.description || "",
        price: Number.parseFloat(item.price) || 0,
        image_url: item.image_url || null,
      }))

      return categories
    }

    // Create sample menu items if nothing else is available
    // This is for debugging purposes and should be removed in production
    if (Object.keys(restaurantData).length > 0 && !Object.keys(menuCategories).length) {
      console.log("Creating sample menu for debugging")
      const categories = {}
      categories[DEFAULT_CATEGORY] = [
        {
          id: "sample1",
          name: "Sample Menu Item",
          description: "This is a sample menu item for debugging",
          price: 9.99,
          image_url: null,
        },
      ]
      return categories
    }

    // Fallback for old structure where menu_categories might be an object
    return restaurantData.menu_categories || {}
  }

  // Debug function
  const logRestaurantMenuData = (restaurant) => {
    if (!restaurant) return

    console.log("Restaurant ID:", restaurant.id)
    console.log("Restaurant Name:", restaurant.name)
    // console.log("menu_categories property:", restaurant.menu_categories);
    // console.log("menu_items property:", restaurant.menu_items);
    console.log("menu property:", restaurant.menu)

    // Log all keys for debugging
    // console.log("All restaurant properties:", Object.keys(restaurant));
  }

  // Update restaurant when data is loaded
  useEffect(() => {
    if (!loading && !error && restaurants && restaurants.length > 0) {
      console.log("All restaurants:", restaurants)
  
      // Try to find restaurant by ID
      const parsedId = isNaN(Number.parseInt(id)) ? id : Number.parseInt(id)
      let foundRestaurant = restaurants.find((rest) => rest.id === parsedId || rest.id === id)
  
      // For debugging: if restaurant not found, log available restaurant IDs
      if (!foundRestaurant) {
        console.error("Restaurant with ID", id, "not found.")
        console.log("Available restaurant IDs:", restaurants.map(r => r.id))
        return
      }
  
      if (foundRestaurant) {
        setRestaurant(foundRestaurant)
        logRestaurantMenuData(foundRestaurant)
  
        // Process menu categories from found restaurant
        const processedCategories = processMenuCategories(foundRestaurant)
        console.log(`Processed categories for Restaurant ${foundRestaurant.id}:`, processedCategories)
        setMenuCategories(processedCategories)
  
        // Only update menu categories once to prevent infinite loop
        if (!menuCategoriesUpdatedRef.current) {
          updateMenuCategories(foundRestaurant.id, processedCategories, foundRestaurant)
          menuCategoriesUpdatedRef.current = true
        }
      }
    }
  }, [id, restaurants, loading, error, updateMenuCategories])

  const prevCartRef = useRef()

  useEffect(() => {
    if (restaurant && restaurant.id) {
      const newCartInfo = calculateCart(restaurant.id)
      // Only update if values actually changed
      if (
        !prevCartRef.current ||
        prevCartRef.current.totalItems !== newCartInfo.totalItems ||
        prevCartRef.current.totalPrice !== newCartInfo.totalPrice
      ) {
        setCartInfo(newCartInfo)
        prevCartRef.current = newCartInfo
      }
    }
  }, [restaurant, calculateCart, restaurantCarts])

  // Set first category as active if not set
  useEffect(() => {
    if (activeCategory === "" && Object.keys(menuCategories).length > 0) {
      setActiveCategory(Object.keys(menuCategories)[0])
    }
  }, [activeCategory, menuCategories])

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      setIsHeaderCollapsed(window.scrollY > 10)

      // Find which category is currently in view
      const categoryPositions = Object.entries(categoryRefs.current).map(([name, ref]) => ({
        name,
        position: ref?.getBoundingClientRect()?.top || 0,
      }))

      const visibleCategory = categoryPositions
        .filter((cat) => cat.position <= 120)
        .sort((a, b) => b.position - a.position)[0]

      if (visibleCategory) {
        setActiveCategory(visibleCategory.name)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Scroll to category when clicked
  const scrollToCategory = (categoryName) => {
    setActiveCategory(categoryName)
    const element = categoryRefs.current[categoryName]
    if (element) {
      const yOffset = -100 // Adjust based on your header height
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: "smooth" })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center p-6 bg-red-50 rounded-lg">
          <p className="text-red-500 font-medium">Error loading menu: {error}</p>
        </div>
      </div>
    )
  }

  if (!restaurant) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center p-6 bg-gray-50 rounded-lg">
          <p className="text-gray-500 font-medium">Restaurant not found. Please try again.</p>
        </div>
      </div>
    )
  }

  const { totalItems, totalPrice } = cartInfo

  return (
    <div className="pt-11 pb-16 bg-gray-50 min-h-screen">
      {/* Back button */}
      <div className="fixed top-4 left-4 z-50">
        <button className="bg-white rounded-full p-2 shadow-md" onClick={handleBack}>
          <ChevronLeft className="h-6 w-6 text-gray-700" />
        </button>
      </div>

      {/* Restaurant Header */}
      <div
        className={`relative transition-all duration-300 ${isHeaderCollapsed ? "h-0 opacity-0 overflow-hidden" : "h-64"}`}
      >
        <img
          src={restaurant.image_url || "/placeholder.svg"}
          alt={restaurant.name}
          className="w-full h-64 object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h1 className="text-3xl font-bold">{restaurant.name}</h1>
          <div className="flex items-center mt-2 space-x-4">
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-400 mr-1" />
              <span className="text-sm">{restaurant.rating || "4.5"}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span className="text-sm">25-35 min</span>
            </div>
          </div>
        </div>
      </div>

      {/* Collapsed Header */}
      <div
        className={`bg-white z-40 shadow-md transition-all ${
          isHeaderCollapsed ? "h-16 opacity-100" : "h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="flex items-center px-16 h-full">
          <h2 className="text-lg font-semibold truncate">{restaurant.name}</h2>
        </div>
      </div>

      {/* Categories Navigation */}
      <div className="sticky top-0 bg-white z-30 shadow-sm pt-4">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex space-x-2 px-4 pb-4 whitespace-nowrap">
            {Object.keys(menuCategories).map((categoryName) => (
              <button
                key={categoryName}
                onClick={() => scrollToCategory(categoryName)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === categoryName
                    ? "bg-primary text-gray-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {categoryName}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Categories and Items */}
      <div className="px-4 pt-6 flex justify-center">
        <div className="w-full max-w-4xl">
          {Object.keys(menuCategories).length > 0 ? (
            Object.entries(menuCategories).map(([categoryName, items]) => (
              <div key={categoryName} ref={(el) => (categoryRefs.current[categoryName] = el)} className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">{categoryName}</h2>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="bg-white rounded-lg shadow-sm overflow-hidden flex">
                      <div className="relative w-24 h-24 sm:w-32 sm:h-32">
                        <img
                          src={item.image_url || "/placeholder.svg?height=128&width=128"}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-2 right-2">
                          {restaurant && restaurantCarts[restaurant.id]?.items[item.id] ? (
                            <div className="flex items-center bg-white rounded-full shadow-md">
                              <button
                                onClick={() => updateItemQuantity(restaurant.id, item.id, -1)}
                                className="p-1 rounded-full text-primary bg-gray-100 hover:bg-gray-200"
                              >
                                <Minus className="h-5 w-5" />
                              </button>
                              <span className="w-6 text-center font-medium">
                                {restaurantCarts[restaurant.id]?.items[item.id] || 0}
                              </span>
                              <button
                                onClick={() => updateItemQuantity(restaurant.id, item.id, 1)}
                                className="p-1 rounded-full text-primary bg-gray-100 hover:bg-gray-200"
                              >
                                <Plus className="h-5 w-5" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => updateItemQuantity(restaurant.id, item.id, 1)}
                              className="bg-primary font-black text-green-500 p-2 rounded-full bg-gray-100 shadow-md hover:bg-primary/90 transition-colors"
                            >
                              <Plus className="h-5 w-5" />
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="flex-1 p-4">
                        <h3 className="text-base font-semibold text-gray-800">{item.name}</h3>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                        <p className="text-primary font-medium mt-2">${item.price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No menu categories available. Restaurant ID: {id}</p>
            </div>
          )}
        </div>
      </div>

      {/* Cart Summary */}
      {totalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-gray-600 font-medium">Your Order</span>
              <span className="font-bold text-lg">${totalPrice.toFixed(2)}</span>
            </div>
            <button
              onClick={handleCheckout}
              className="bg-amber-400 text-gray-800 font-bold py-3 px-6 rounded-lg flex items-center"
            >
              <ShoppingBag className="h-5 w-5 mr-2 text-gray-800" />
              <span>
                View Cart ({totalItems} item{totalItems !== 1 ? "s" : ""})
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

