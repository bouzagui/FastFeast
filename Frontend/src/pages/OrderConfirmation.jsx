import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, Home, Clock, ArrowRight } from "lucide-react";

const OrderConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderData = location.state || {
    orderId: "Unknown",
    items: [],
    total: 0,
    address: "",
    estimatedDelivery: "Unknown"
  };
  
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-10 w-10 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Order Confirmed!</h1>
          <p className="text-gray-600 mt-1">Your order has been placed successfully</p>
        </div>
        
        <div className="border-t border-b border-gray-200 py-4 my-4">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Order ID:</span>
            <span className="font-medium">{orderData.orderId}</span>
          </div>
          <div className="flex items-start mb-3">
            <Home className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
            <div>
              <span className="text-gray-600 block">Delivery Address:</span>
              <span className="font-medium">{orderData.address}</span>
            </div>
          </div>
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-gray-500 mr-2" />
            <div>
              <span className="text-gray-600 block">Estimated Delivery:</span>
              <span className="font-medium">{orderData.estimatedDelivery}</span>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="font-bold text-gray-800 mb-3">Order Summary</h2>
          <div className="space-y-2 mb-4">
            {orderData.items.map((item, index) => (
              <div key={index} className="flex justify-between">
                <span>{item.quantity}× {item.name}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-3 flex justify-between font-bold">
            <span>Total</span>
            <span>${orderData.total.toFixed(2)}</span>
          </div>
        </div>
        
        <div className="flex flex-col space-y-3">
          <button 
            onClick={() => window.open(`/track-order/${orderData.orderId}`, "_blank")}
            className="w-full py-3 px-4 bg-primary text-gray-800 font-bold rounded-lg flex items-center justify-center"
          >
            <Clock className="h-5 w-5 mr-2" />
            Track Order
          </button>
          
          <button 
            onClick={() => navigate("/restaurants")}
            className="w-full py-3 px-4 bg-gray-100 text-gray-800 font-bold rounded-lg flex items-center justify-center"
          >
            Continue Shopping
            <ArrowRight className="h-5 w-5 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
