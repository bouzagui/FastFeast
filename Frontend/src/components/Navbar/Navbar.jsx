import React from 'react'
import { ShoppingCart } from 'lucide-react'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react'
import { useCart } from '../../pages/MenuPage' // Make sure the path is correct

function Navbar() {
  const { calculateCart, toggleCart, cartVisible } = useCart() || { 
    calculateCart: () => ({ totalItems: 0, totalPrice: 0 }), 
    toggleCart: () => {}, 
    cartVisible: false 
  }
  
  // This assumes you have access to the menuCategories globally
  // You might need to adjust how you access this data depending on your app structure
  const { totalItems } = calculateCart(window.menuCategories)

  return (
    <div>
      <nav className="p-0 m-0 bg-amber-400 size-auto">
        <div className="ml-11 mr-11">
          <div className="flex justify-between items-center">
            <a href="/" className="m-0 p-0 font-extrabold text-2xl">logo</a>
            <div className='grid grid-cols-3 relative top-2'>
              <a href="/" className='relative right-11 font-bold text-[20px]'>home</a>
              <div className="relative">
                <ShoppingCart className='size-8 mr-16 cursor-pointer' onClick={toggleCart} />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </div>
              <div className='relative font-bold size-12'>
                <SignedOut>
                  <SignInButton />
                </SignedOut>
                <SignedIn>
                  <UserButton />
                </SignedIn>
              </div>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Cart Dropdown */}
      {cartVisible && (
        <div className="absolute right-16 top-16 bg-white rounded-lg shadow-xl p-4 w-80 z-50">
          <h3 className="font-bold text-lg mb-4">Your Cart</h3>
          {totalItems > 0 ? (
            <>
              <div className="max-h-64 overflow-y-auto">
                {/* Cart items would go here */}
                <p className="text-gray-600">Cart items will be displayed here</p>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between mb-2">
                  <span>Total:</span>
                  <span className="font-bold">${calculateCart(window.menuCategories).totalPrice.toFixed(2)}</span>
                </div>
                <button className="w-full bg-amber-400 text-gray-800 font-bold py-2 rounded-lg">
                  Checkout
                </button>
              </div>
            </>
          ) : (
            <p className="text-gray-500 text-center py-4">Your cart is empty</p>
          )}
        </div>
      )}
    </div>
  )
}

export default Navbar