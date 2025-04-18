import { ShoppingCart, X } from 'lucide-react'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react'
import { useCart } from '../context/CartProvider'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

function Navbar() {
  const {
    // calculateCart,
    toggleCart,
    cartVisible,
    restaurantCarts,
    updateItemQuantity,
    getAllCartItems,
    calculateTotalCart
  } = useCart() || {}

  const [cartTotal, setCartTotal] = useState({ totalItems: 0, totalPrice: 0 })
  const navigate = useNavigate()
  // Track cart changes and update totals
  useEffect(() => {
    // This will update whenever restaurantCarts changes
    if (calculateTotalCart) {
      const totals = calculateTotalCart()
      setCartTotal(totals)
    }
  }, [restaurantCarts, calculateTotalCart])

  const handleCheckout = () => {
    navigate("/checkout")
  }

  // For debugging
  useEffect(() => {
    console.log("Current restaurantCarts:", restaurantCarts)
    if (getAllCartItems) {
      console.log("getAllCartItems result:", getAllCartItems())
    }
    if (calculateTotalCart) {
      console.log("calculateTotalCart result:", calculateTotalCart())
    }
  }, [restaurantCarts, getAllCartItems, calculateTotalCart])

  // Get all cart items across restaurants
  const getCartItems = () => {
    const items = [];
    if (!restaurantCarts) return items;
  
    Object.entries(restaurantCarts).forEach(([restaurantId, restaurantCart]) => {
      if (!restaurantCart || !restaurantCart.items) return;
  
      Object.entries(restaurantCart.items).forEach(([itemId, quantity]) => {
        if (quantity > 0) {
          const menuItem = restaurantCart.menuItems?.[itemId];
          if (menuItem) {
            items.push({
              id: itemId,
              restaurantId,
              name: menuItem.name,
              price: menuItem.price,
              quantity,
              image_url: menuItem.image_url,
              restaurantName: restaurantCart.restaurantInfo?.name || 'Restaurant',
            });
          }
        }
      });
    });
  
    console.log("Generated cart items:", items);
    return items;
  };

  // Remove item from cart
  const handleRemoveItem = (restaurantId, itemId) => {
    if (updateItemQuantity) {
      // Get current quantity
      const currentQty = restaurantCarts[restaurantId]?.items[itemId] || 0
      // Remove by setting to 0
      updateItemQuantity(restaurantId, itemId, -currentQty)
    }
  }

  // Get all cart items
  const allCartItems = getCartItems()

  return (
    <div>
      <nav className="p-0 m-0 bg-amber-400 shadow-md size-auto fixed top-0 left-0 right-0 z-40">
        <div className="mx-6 md:mx-11">
          <div className="flex justify-between items-center h-16">
            <a href="/" className="m-0 p-0 font-extrabold text-2xl">logo</a>
            <div className="flex items-center space-x-6">
              <div className="relative">
                <ShoppingCart 
                  className="size-7 cursor-pointer hover:text-amber-700 transition-colors" 
                  onClick={toggleCart} 
                />
                {cartTotal.totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartTotal.totalItems}
                  </span>
                )}
              </div>
              <div className="relative">
                <SignedOut>
                  <SignInButton mode="modal" redirectUrl="/" signUpUrl="/sign-up" signInUrl="/sign-in">
                    <button className="font-bold text-sm px-3 py-1 bg-white rounded-full hover:bg-gray-100 transition-colors">
                      Sign In
                    </button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <UserButton afterSignOutUrl="/" />
                </SignedIn>
              </div>
            </div>
          </div>
        </div>
      </nav>
      
      {cartVisible && (
        <div className="fixed right-4 top-16 bg-white rounded-lg shadow-xl w-80 md:w-96 z-50 border border-gray-200">
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="font-bold text-lg">Your Cart</h3>
            <button onClick={toggleCart} className="text-gray-500 hover:text-gray-700">
              <X size={18} />
            </button>
          </div>
          
          {/* Cart Items */}
          <div className="max-h-80 overflow-y-auto">
            {allCartItems.length > 0 ? (
              allCartItems.map((item) => (
                <div key={`${item.restaurantId}-${item.id}`} className="flex items-start p-4 border-b">
                  <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden mr-3">
                    <img 
                      src={item.image_url || "/placeholder.svg"}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          From: {item.restaurantName}
                        </p>
                      </div>
                      <button 
                        onClick={() => handleRemoveItem(item.restaurantId, item.id)} 
                        className="text-gray-400 hover:text-red-500 p-1"
                        aria-label="Remove item"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center">
                        <button 
                          onClick={() => updateItemQuantity(item.restaurantId, item.id, -1)}
                          className="p-1 text-gray-500 hover:bg-gray-100 rounded-full"
                          disabled={item.quantity <= 1}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="5" y1="12" x2="19" y2="12" />
                          </svg>
                        </button>
                        <span className="mx-2 text-sm font-medium">{item.quantity}</span>
                        <button 
                          onClick={() => updateItemQuantity(item.restaurantId, item.id, 1)}
                          className="p-1 text-gray-500 hover:bg-gray-100 rounded-full"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                          </svg>
                        </button>
                      </div>
                      <p className="font-bold text-sm">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-500 text-center py-8">
                <ShoppingCart className="mx-auto mb-2 text-gray-400" size={24} />
                <p>Your cart is empty</p>
              </div>
            )}
          </div>
          
          {/* Cart Footer */}
          {allCartItems.length > 0 && (
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-between mb-4">
                <span className="font-medium">Subtotal:</span>
                <span className="font-bold">${cartTotal.totalPrice.toFixed(2)}</span>
              </div>
              
              <button
                onClick={handleCheckout}
                className="w-full bg-amber-400 text-gray-800 font-bold py-3 rounded-lg hover:bg-amber-500 transition-colors">
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Navbar