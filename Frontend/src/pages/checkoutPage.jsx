import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, CreditCard, MapPin, Clock, Truck } from "lucide-react";
import { useCart } from "../pages/MenuPage"; // Adjust path as needed
import { useUser } from "@clerk/clerk-react";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { menuCategories, itemQuantity, calculateCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [address, setAddress] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { isSignedIn } = useUser();

  useEffect(() => {
    if (!isSignedIn) {
      navigate('/sign-in', { replace: true});
    }
  }, [isSignedIn, navigate]);
  
  // Get cart details
  const { totalItems, totalPrice } = calculateCart(menuCategories);
  
  // Additional fees
  const deliveryFee = 3.99;
  const serviceFee = 2.50;
  const tax = totalPrice * 0.08; // Assuming 8% tax
  const grandTotal = totalPrice + deliveryFee + serviceFee + tax;
  
  // Items in cart for display
  const cartItems = [];
  if (menuCategories) {
    Object.entries(menuCategories).forEach(([_, items]) => {
      items.forEach((item) => {
        const quantity = itemQuantity[item.id] || 0;
        if (quantity > 0) {
          cartItems.push({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity
          });
        }
      });
    });
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!address) {
      alert("Please enter your delivery address");
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      // Navigate to order confirmation page
      navigate("/order-confirmation", { 
        state: { 
          orderId: "ORD" + Math.floor(100000 + Math.random() * 900000),
          items: cartItems,
          total: grandTotal,
          address,
          estimatedDelivery: "25-35 min"
        }
      });
    }, 2000);
  };
  
  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* Header */}
      <div className="bg-white sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center">
          <button 
            onClick={() => navigate(-1)} 
            className="mr-4"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-bold">Checkout</h1>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left side - Order summary */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-lg font-bold mb-4">Order Summary</h2>
              
              {cartItems.length > 0 ? (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div className="flex items-center">
                        <span className="text-gray-700 font-medium mr-2">{item.quantity}×</span>
                        <span>{item.name}</span>
                      </div>
                      <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Your cart is empty</p>
              )}
            </div>
            
            {/* Delivery Address */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="flex items-center mb-4">
                <MapPin className="text-gray-700 mr-2 h-5 w-5" />
                <h2 className="text-lg font-bold">Delivery Address</h2>
              </div>
              
              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                rows="3"
                placeholder="Enter your delivery address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              ></textarea>
              
              <div className="mt-4 flex items-center text-gray-600">
                <Clock className="h-4 w-4 mr-2" />
                <span className="text-sm">Estimated delivery time: 25-35 min</span>
              </div>
            </div>
            
            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <CreditCard className="text-gray-700 mr-2 h-5 w-5" />
                <h2 className="text-lg font-bold">Payment Method</h2>
              </div>
              
              <div className="space-y-3">
                <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={() => setPaymentMethod("card")}
                    className="mr-3"
                  />
                  <span>Credit/Debit Card</span>
                </label>
                
                <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className="mr-3"
                  />
                  <span>Cash on Delivery</span>
                </label>
                
                {paymentMethod === "card" && (
                  <div className="mt-4 p-4 border border-gray-200 rounded-lg">
                    <div className="mb-4">
                      <label className="block text-sm text-gray-700 mb-1">Card Number</label>
                      <input 
                        type="text" 
                        className="w-full p-2 border border-gray-300 rounded" 
                        placeholder="1234 5678 9012 3456"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">Expiry Date</label>
                        <input 
                          type="text" 
                          className="w-full p-2 border border-gray-300 rounded" 
                          placeholder="MM/YY"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">CVV</label>
                        <input 
                          type="text" 
                          className="w-full p-2 border border-gray-300 rounded" 
                          placeholder="123"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Right side - Price summary and checkout button */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-24">
              <h2 className="text-lg font-bold mb-4">Price Details</h2>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Items ({totalItems})</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Service Fee</span>
                  <span>${serviceFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-bold">
                  <span>Total</span>
                  <span>${grandTotal.toFixed(2)}</span>
                </div>
              </div>
              
              <button
                onClick={handleSubmit}
                disabled={isProcessing || cartItems.length === 0}
                className={`w-full py-3 px-4 rounded-lg font-bold flex items-center justify-center ${
                  isProcessing || cartItems.length === 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-amber-400 text-gray-800 hover:bg-amber-500"
                }`}
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-gray-800 mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Truck className="h-5 w-5 mr-2" />
                    Place Order
                  </>
                )}
              </button>
              
              {cartItems.length === 0 && (
                <p className="text-red-500 text-sm mt-2 text-center">Your cart is empty</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
