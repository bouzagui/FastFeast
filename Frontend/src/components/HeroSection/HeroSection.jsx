import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, CreditCard, MapPin, Clock, Truck } from "lucide-react";
import { useCart } from "../../context/CartProvider";
import { useUser } from "@clerk/clerk-react";
import useNearbyRestaurants from "../../hooks/useNearbyRestaurants";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { 
    calculateCart, 
    currentRestaurantId,
    restaurantCarts,
    clearCart 
  } = useCart();
  const [paymentMethod, setPaymentMethod] = useState("cod"); // Default to cash on delivery
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const { isSignedIn, user } = useUser();
  const { location, loading, error, userAddress } = useNearbyRestaurants();
  
  // Card details state
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: ""
  });

  useEffect(() => {
    if (!isSignedIn) {
      navigate('/sign-in', { replace: true });
    }
  }, [isSignedIn, navigate]);

  // Get cart details
  const { totalItems, totalPrice } =  currentRestaurantId ? 
    calculateCart(currentRestaurantId) : { totalItems: 0, totalPrice: 0 };

  // Additional fees
  const deliveryFee = 0.99;
  const serviceFee = 0.20;
  const tax = totalPrice * 0.08; // Assuming 8% tax
  const grandTotal = totalPrice + deliveryFee + serviceFee + tax;

  // Items in cart for display
  const cartItems = [];

  if (currentRestaurantId && restaurantCarts[currentRestaurantId]) {
    const { items: itemQuantities, menuCategories } = restaurantCarts[currentRestaurantId];

    if (menuCategories) {
      Object.entries(menuCategories).forEach(([_, categoryItems]) => {
        categoryItems.forEach((item) => {
          const quantity = itemQuantities[item.id] || 0;
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
  }

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const processPayment = async () => {
    try {
      // Create order payload
      const orderPayload = {
        userId: user?.id,
        restaurantId: currentRestaurantId,
        items: cartItems.map(item => ({
          itemId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        paymentMethod,
        paymentDetails: paymentMethod === "card" ? {
          cardNumber: cardDetails.cardNumber.replace(/\s/g, ''),
          expiryDate: cardDetails.expiryDate,
          // Don't send full CVV to your backend for security reasons
          // Use a payment processor instead
        } : null,
        deliveryAddress: userAddress,
        fees: {
          subtotal: totalPrice,
          deliveryFee,
          serviceFee,
          tax,
          total: grandTotal
        }
      };

      // Send to your backend
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await user?.getIdToken()}`
        },
        body: JSON.stringify(orderPayload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Payment processing failed');
      }

      const data = await response.json();
      
      // Clear cart after successful order
      clearCart(currentRestaurantId);
      
      // Navigate to order confirmation page
      navigate("/order-confirmation", {
        state: {
          orderId: data.orderId,
          items: cartItems,
          total: grandTotal,
          address: userAddress || "No location detected",
          estimatedDelivery: data.estimatedDelivery || "25-35 min",
          paymentMethod: paymentMethod === "cod" ? "Cash on Delivery" : "Credit/Debit Card"
        }
      });
    } catch (error) {
      console.error("Order processing error:", error);
      setPaymentError(error.message || "Order processing failed. Please try again.");
      setIsProcessing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setPaymentError("");

    // Only validate card details if payment method is "card"
    if (paymentMethod === "card") {
      // Basic card validation
      if (!cardDetails.cardNumber || !cardDetails.expiryDate || !cardDetails.cvv) {
        setPaymentError("Please fill in all card details");
        setIsProcessing(false);
        return;
      }
      
      // Validate card number format (basic check)
      const cardNumberClean = cardDetails.cardNumber.replace(/\s/g, '');
      if (!/^\d{16}$/.test(cardNumberClean)) {
        setPaymentError("Invalid card number format");
        setIsProcessing(false);
        return;
      }
      
      // Validate expiry date format (MM/YY)
      if (!/^\d{2}\/\d{2}$/.test(cardDetails.expiryDate)) {
        setPaymentError("Invalid expiry date format (use MM/YY)");
        setIsProcessing(false);
        return;
      }
      
      // Validate CVV format
      if (!/^\d{3,4}$/.test(cardDetails.cvv)) {
        setPaymentError("Invalid CVV");
        setIsProcessing(false);
        return;
      }
    }
    // For COD, we skip all card validations and proceed directly

    // Process the order with backend
    await processPayment();
  };

  // Format card number with spaces
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
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
              {loading ? (
                <p className="text-gray-500">Fetching address...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : userAddress ? (
                <p className="text-gray-700">{userAddress}</p>
              ) : (
                <p className="text-gray-500">Address not found</p>
              )}

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
                {/* Cash on Delivery option first */}
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

                {/* Only show card details form when card payment is selected */}
                {paymentMethod === "card" && (
                  <div className="mt-4 p-4 border border-gray-200 rounded-lg">
                    {paymentError && (
                      <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
                        {paymentError}
                      </div>
                    )}
                    <div className="mb-4">
                      <label className="block text-sm text-gray-700 mb-1">Card Number</label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={cardDetails.cardNumber}
                        onChange={(e) => {
                          const formatted = formatCardNumber(e.target.value);
                          setCardDetails(prev => ({
                            ...prev,
                            cardNumber: formatted
                          }));
                        }}
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="1234 5678 9012 3456"
                        maxLength="19"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">Expiry Date</label>
                        <input
                          type="text"
                          name="expiryDate"
                          value={cardDetails.expiryDate}
                          onChange={handleCardInputChange}
                          className="w-full p-2 border border-gray-300 rounded"
                          placeholder="MM/YY"
                          maxLength="5"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">CVV</label>
                        <input
                          type="password"
                          name="cvv"
                          value={cardDetails.cvv}
                          onChange={handleCardInputChange}
                          className="w-full p-2 border border-gray-300 rounded"
                          placeholder="123"
                          maxLength="4"
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
                className={`w-full py-3 px-4 rounded-lg font-bold flex items-center justify-center ${isProcessing || cartItems.length === 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-amber-400 text-gray-800 hover:bg-amber-500"
                  }`}
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-gray-800 mr-2"></div>
                    {paymentMethod === "card" ? "Processing Payment..." : "Placing Order..."}
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

              {/* Payment method indicator */}
              <div className="mt-4 text-center text-sm text-gray-600">
                {paymentMethod === "cod" ? (
                  <p>You will pay in cash upon delivery</p>
                ) : (
                  <p>You will be charged via card immediately</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;