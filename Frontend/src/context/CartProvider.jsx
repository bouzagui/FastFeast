"use client"

import { useCallback, useState, createContext, useContext, useEffect } from "react"

export const CartContext = createContext()

// Custom hook to use the cart context
export const useCart = () => useContext(CartContext)

// CartProvider component
export function CartProvider({ children }) {
  const [cartVisible, setCartVisible] = useState(false)
  const [restaurantCarts, setRestaurantCarts] = useState(() => {
    const storedCart = localStorage.getItem("restaurantCarts")
    return storedCart ? JSON.parse(storedCart) : {}
  })
  const [currentRestaurantId, setCurrentRestaurantId] = useState(null)

  const toggleCart = () => {
    setCartVisible(!cartVisible)
  }

  // Function to get the current restaurant's cart
  const getCurrentCart = useCallback(() => {
    return restaurantCarts[currentRestaurantId] || { items: {}, menuCategories: null }
  }, [currentRestaurantId, restaurantCarts])

  // Update this function to work with restaurant-specific carts
  const updateItemQuantity = useCallback((restaurantId, itemId, change) => {
    setRestaurantCarts((prevCarts) => {
      const restaurantCart = prevCarts[restaurantId] || {
        items: {},
        menuCategories: null,
        restaurantName: "", // Store restaurant name for display in cart
        restaurantImage: "", // Store restaurant image for display in cart
      }
      const currentQuantity = restaurantCart.items[itemId] || 0
      const newQuantity = Math.max(0, currentQuantity + change)

      // Create updated cart
      const updatedCart = {
        ...restaurantCart,
        items: {
          ...restaurantCart.items,
        },
      }

      // Only add the item if quantity is not 0
      if (newQuantity > 0) {
        updatedCart.items[itemId] = newQuantity
      } else if (updatedCart.items[itemId]) {
        // Remove item if quantity is 0
        delete updatedCart.items[itemId]
      }

      const updatedCarts = {
        ...prevCarts,
        [restaurantId]: updatedCart,
      }

      localStorage.setItem("restaurantCarts", JSON.stringify(updatedCarts))
      return updatedCarts
    })
  }, [])

  // Update menu categories for a specific restaurant
  const updateMenuCategories = useCallback((restaurantId, menuCategories, restaurantData) => {
    if (!restaurantId) {
      console.error("Restaurant ID is required to update menu categories")
      return
    }
  
    setCurrentRestaurantId(restaurantId)
    setRestaurantCarts((prevCarts) => {
      const restaurantCart = prevCarts[restaurantId] || { 
        items: {}, 
        menuCategories: null,
        restaurantName: "",
        restaurantImage: ""
      }
  
      const updatedCarts = {
        ...prevCarts,
        [restaurantId]: {
          ...restaurantCart,
          menuCategories: menuCategories,
          restaurantName: restaurantData?.name || "",
          restaurantImage: restaurantData?.image_url || "",
        },
      }
  
      // Ensure menu categories are unique per restaurant
      console.log(`Updated menu categories for Restaurant ${restaurantId}:`, menuCategories)
  
      localStorage.setItem("restaurantCarts", JSON.stringify(updatedCarts))
      return updatedCarts
    })
  }, []);

  // Calculate cart for a specific restaurant
  const calculateCart = useCallback(
    (restaurantId) => {
      const restaurantCart = restaurantCarts[restaurantId] || { items: {}, menuCategories: null }
      const { items, menuCategories } = restaurantCart

      if (!items || !menuCategories) return { totalItems: 0, totalPrice: 0 }

      let totalItems = 0
      let totalPrice = 0

      // Iterate through all categories and items
      Object.entries(menuCategories).forEach(([_, categoryItems]) => {
        categoryItems.forEach((item) => {
          const quantity = items[item.id] || 0
          totalItems += quantity
          totalPrice += quantity * item.price
        })
      })

      return { totalItems, totalPrice }
    },
    [restaurantCarts],
  )

  // Calculate total items and price across all restaurants
  const calculateTotalCart = useCallback(() => {
    let totalItems = 0
    let totalPrice = 0

    Object.keys(restaurantCarts).forEach((restaurantId) => {
      const { totalItems: items, totalPrice: price } = calculateCart(restaurantId)
      totalItems += items
      totalPrice += price
    })

    return { totalItems, totalPrice }
  }, [restaurantCarts, calculateCart])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("restaurantCarts", JSON.stringify(restaurantCarts))
  }, [restaurantCarts])

  // Add this function to get all restaurant carts with items
  const getAllCarts = useCallback(() => {
    return Object.entries(restaurantCarts)
      .filter(([_, cart]) => cart.items && Object.keys(cart.items).length > 0)
      .reduce((acc, [id, cart]) => {
        acc[id] = cart
        return acc
      }, {})
  }, [restaurantCarts])

  // Get all items from all restaurants for display in cart
  const getAllCartItems = useCallback(() => {
    const allItems = []

    Object.entries(restaurantCarts).forEach(([restaurantId, cart]) => {
      if (!cart.items || !cart.menuCategories) return

      const { items: itemQuantities, menuCategories, restaurantName, restaurantImage } = cart

      // Flatten all menu items from all categories
      const allMenuItems = []
      Object.values(menuCategories).forEach((categoryItems) => {
        allMenuItems.push(...categoryItems)
      })

      // Add items with quantity > 0 to the result
      Object.entries(itemQuantities).forEach(([itemId, quantity]) => {
        if (quantity > 0) {
          const menuItem = allMenuItems.find((item) => item.id === itemId)
          if (menuItem) {
            allItems.push({
              ...menuItem,
              quantity,
              restaurantId,
              restaurantName: restaurantName || "Restaurant",
              restaurantImage: restaurantImage || "",
            })
          }
        }
      })
    })

    return allItems
  }, [restaurantCarts])

  // Add getAllCarts to the context value
  return (
    <CartContext.Provider
      value={{
        getCurrentCart,
        updateItemQuantity,
        calculateCart,
        calculateTotalCart,
        cartVisible,
        toggleCart,
        currentRestaurantId,
        updateMenuCategories,
        restaurantCarts,
        getAllCarts,
        getAllCartItems,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

