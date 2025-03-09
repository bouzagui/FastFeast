import { useState, useRef, useEffect, createContext, useContext } from "react"
import { useParams } from "react-router-dom"
import useNearbyRestaurants from "../hooks/useNearbyRestaurants"
import { ChevronLeft, Clock, Star, Minus, Plus, ShoppingBag } from "lucide-react"
// Create the context

export const CartContext = createContext()

// Custom hook to use the cart context
export const useCart = () => useContext(CartContext)

// CartProvider component
export function CartProvider({ children }) {
  const [itemQuantity, setItemQuantity] = useState({})
  const [cartVisible, setCartVisible] = useState(false)

  const updateItemQuantity = (itemId, change) => {
    setItemQuantity((prevState) => {
      const currentQuantity = prevState[itemId] || 0
      const newQuantity = Math.max(0, currentQuantity + change)
      return { ...prevState, [itemId]: newQuantity }
    })
  }

  // Calculate total items and price
  const calculateCart = (menuCategories) => {
    if (!menuCategories) return { totalItems: 0, totalPrice: 0 }

    let totalItems = 0
    let totalPrice = 0

    Object.entries(menuCategories).forEach(([_, items]) => {
      items.forEach((item) => {
        const quantity = itemQuantity[item.id] || 0
        totalItems += quantity
        totalPrice += quantity * item.price
      })
    })

    return { totalItems, totalPrice }
  }

  const toggleCart = () => {
    setCartVisible(!cartVisible)
  }

  return (
    <CartContext.Provider
      value={{
        itemQuantity,
        updateItemQuantity,
        calculateCart,
        cartVisible,
        toggleCart
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export default function MenuPage() {
  const { id } = useParams()
  const { restaurants, loading, error } = useNearbyRestaurants()
  const [activeCategory, setActiveCategory] = useState("")
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false)
  const categoryRefs = useRef({})
  const { itemQuantity, updateItemQuantity, calculateCart } = useCart()

  useEffect(() => {
    const handleScroll = () => {
      setIsHeaderCollapsed(window.scrollY > 10)

      // Find which category is currently in view
      const categoryPositions = Object.entries(categoryRefs.current).map(([name, ref]) => ({
        name,
        position: ref.getBoundingClientRect().top,
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

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )

  if (error)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center p-6 bg-red-50 rounded-lg">
          <p className="text-red-500 font-medium">Error loading menu: {error}</p>
        </div>
      </div>
    )

  // Find the restaurant by ID
  const restaurant = restaurants.find((rest) => rest.id === id)

  if (!restaurant) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center p-6 bg-gray-50 rounded-lg">
          <p className="text-gray-500 font-medium">Restaurant not found.</p>
        </div>
      </div>
    )
  }

  // Extract menu categories from the restaurant
  const menuCategories = restaurant.menu_categories || {}

  // Set first category as active if not set
  if (activeCategory === "" && Object.keys(menuCategories).length > 0) {
    setActiveCategory(Object.keys(menuCategories)[0])
  }

  const { totalItems, totalPrice } = calculateCart(menuCategories)

  return (
    <div className="pb-24 bg-gray-50 min-h-screen">
      {/* Back button */}
      <div className="fixed top-4 left-4 z-50">
        <button className="bg-white rounded-full p-2 shadow-md" onClick={() => window.history.back()}>
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
        className={`fixed top-0 left-0 right-0 bg-white z-40 shadow-md transition-all duration-300 ${
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
                          {itemQuantity[item.id] ? (
                            <div className="flex items-center bg-white rounded-full shadow-md">
                              <button
                                onClick={() => updateItemQuantity(item.id, -1)}
                                className="p-1 rounded-full text-primary bg-gray-100 hover:bg-gray-200"
                              >
                                <Minus className="h-5 w-5" />
                              </button>
                              <span className="w-6 text-center font-medium">{itemQuantity[item.id]}</span>
                              <button
                                onClick={() => updateItemQuantity(item.id, 1)}
                                className="p-1 rounded-full text-primary bg-gray-100 hover:bg-gray-200"
                              >
                                <Plus className="h-5 w-5" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => updateItemQuantity(item.id, 1)}
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
              <p className="text-gray-500">No menu categories available.</p>
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
            <button className="bg-amber-400 text-gray-800 font-bold py-3 px-6 rounded-lg flex items-center">
              <ShoppingBag className="h-5 w-5 mr-2" />
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