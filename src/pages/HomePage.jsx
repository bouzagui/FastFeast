import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Search, MapPin, Clock, Star, ArrowRight, Utensils, Truck, CreditCard, ChevronRight } from "lucide-react"
import useNearbyRestaurants from "../hooks/useNearbyRestaurants"
import HeroSection from "../components/HeroSection/HeroSection"

export default function HomePage() {
  const navigate = useNavigate()
  const { restaurants, loading, userAddress } = useNearbyRestaurants()
  const [searchQuery, setSearchQuery] = useState("")
  const [featuredRestaurants, setFeaturedRestaurants] = useState([])

  // Categories for food types
  const categories = [
    { id: 1, name: "Pizza", icon: "🍕", color: "bg-red-100" },
    { id: 2, name: "Burgers", icon: "🍔", color: "bg-amber-100" },
    { id: 3, name: "Sushi", icon: "🍣", color: "bg-blue-100" },
    { id: 4, name: "Salads", icon: "🥗", color: "bg-green-100" },
    { id: 5, name: "Desserts", icon: "🍰", color: "bg-pink-100" },
    { id: 6, name: "Drinks", icon: "🥤", color: "bg-purple-100" },
  ]

  // Special offers
  const offers = [
    {
      id: 1,
      title: "Free Delivery",
      description: "On your first order with code WELCOME",
      color: "bg-amber-400",
      textColor: "text-gray-800",
    },
    {
      id: 2,
      title: "20% OFF",
      description: "For orders above $30 with code SAVE20",
      color: "bg-green-500",
      textColor: "text-white",
    },
    {
      id: 3,
      title: "Happy Hour",
      description: "15% OFF on all orders between 2-5 PM",
      color: "bg-blue-500",
      textColor: "text-white",
    },
  ]

  // Testimonials
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=60&width=60",
      rating: 5,
      text: "The food arrived hot and fresh. The delivery was super quick, and the app is so easy to use!",
    },
    {
      id: 2,
      name: "Michael Chen",
      avatar: "/placeholder.svg?height=60&width=60",
      rating: 5,
      text: "I love being able to order from multiple restaurants in one order. This app has changed how I eat!",
    },
    {
      id: 3,
      name: "Jessica Williams",
      avatar: "/placeholder.svg?height=60&width=60",
      rating: 4,
      text: "Great selection of restaurants and the delivery is always on time. Highly recommend!",
    },
  ]

  // Set featured restaurants when data is loaded
  useEffect(() => {
    if (restaurants && restaurants.length > 0) {
      // Get 4 random restaurants for featured section
      const shuffled = [...restaurants].sort(() => 0.5 - Math.random())
      setFeaturedRestaurants(shuffled.slice(0, 4))
    }
  }, [restaurants])

  const handleSearch = (e) => {
    e.preventDefault()
    navigate(`/restaurants?search=${searchQuery}`)
  }

  const handleRestaurantClick = (id) => {
    navigate(`/MenuPage/${id}`)
  }

  const handleCategoryClick = (category) => {
    navigate(`/restaurants?category=${category}`)
  }

  return (
    <div className="bg-gray-50 min-h-screen ">
      {/* Hero Section */}
      <HeroSection />
      {/* Categories Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Browse Categories</h2>
          <button
            onClick={() => navigate("/restaurants")}
            className="flex items-center text-amber-500 font-semibold hover:text-amber-600"
          >
            View All <ChevronRight className="h-5 w-5 ml-1" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.name)}
              className={`${category.color} rounded-xl p-4 text-center hover:shadow-md transition-shadow`}
            >
              <div className="text-4xl mb-2">{category.icon}</div>
              <h3 className="font-medium text-gray-800">{category.name}</h3>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Restaurants */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Featured Restaurants</h2>
          <button
            onClick={() => navigate("/restaurants")}
            className="flex items-center text-amber-500 font-semibold hover:text-amber-600"
          >
            View All <ChevronRight className="h-5 w-5 ml-1" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            Array(4)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-4">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                  </div>
                </div>
              ))
          ) : featuredRestaurants.length > 0 ? (
            featuredRestaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleRestaurantClick(restaurant.id)}
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={restaurant.image_url || "/placeholder.svg?height=192&width=384"}
                    alt={restaurant.name}
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-900 mb-1">{restaurant.name}</h3>
                  <div className="flex items-center mb-2">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    <span className="text-sm font-medium">{restaurant.rating || "4.5"}</span>
                    <span className="mx-2 text-gray-300">•</span>
                    <span className="text-sm text-gray-500">
                      {restaurant.distance ? `${restaurant.distance.toFixed(1)} km` : "Nearby"}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>25-35 min</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-4 text-center py-8">
              <p className="text-gray-500">No restaurants available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Special Offers */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Special Offers</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className={`${offer.color} ${offer.textColor} rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow`}
            >
              <h3 className="text-2xl font-bold mb-2">{offer.title}</h3>
              <p className="mb-4">{offer.description}</p>
              <button className="flex items-center font-semibold">
                Order Now <ArrowRight className="h-5 w-5 ml-2" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">How It Works</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Utensils className="h-8 w-8 text-amber-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Choose Your Restaurant</h3>
            <p className="text-gray-600">Browse from our selection of the best restaurants in your area.</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="h-8 w-8 text-amber-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Make Your Order</h3>
            <p className="text-gray-600">Select your favorite meals and pay securely online.</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Truck className="h-8 w-8 text-amber-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Fast Delivery</h3>
            <p className="text-gray-600">Your food will be delivered to your door in minutes.</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">What Our Customers Say</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <img
                  src={testimonial.avatar || "/placeholder.svg"}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h3 className="font-bold text-gray-900">{testimonial.name}</h3>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < testimonial.rating ? "text-yellow-400" : "text-gray-300"}`}
                        fill={i < testimonial.rating ? "currentColor" : "none"}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 italic">"{testimonial.text}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* Download App */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h2 className="text-3xl font-bold mb-4">Download Our Mobile App</h2>
            <p className="text-gray-300 mb-6 max-w-md">
              Get the full experience with our mobile app. Order food, track your delivery in real-time, and get
              exclusive offers.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold flex items-center hover:bg-gray-100 transition-colors">
                <svg className="h-6 w-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.707,9.293l-5-5c-0.391-0.391-1.023-0.391-1.414,0l-5,5C5.898,9.684,6.157,10,6.5,10H10v7.5 C10,17.776,10.224,18,10.5,18h3c0.276,0,0.5-0.224,0.5-0.5V10h3.5C17.843,10,18.102,9.684,17.707,9.293z" />
                </svg>
                App Store
              </button>
              <button className="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold flex items-center hover:bg-gray-100 transition-colors">
                <svg className="h-6 w-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.707,9.293l-5-5c-0.391-0.391-1.023-0.391-1.414,0l-5,5C5.898,9.684,6.157,10,6.5,10H10v7.5 C10,17.776,10.224,18,10.5,18h3c0.276,0,0.5-0.224,0.5-0.5V10h3.5C17.843,10,18.102,9.684,17.707,9.293z" />
                </svg>
                Google Play
              </button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img src="/placeholder.svg?height=400&width=300" alt="Mobile App" className="max-w-xs" />
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-amber-50 rounded-2xl p-8 md:p-12">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Stay Updated</h2>
            <p className="text-gray-600 mb-6">
              Subscribe to our newsletter for exclusive deals, new restaurants, and more.
            </p>
            <form className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <button
                type="submit"
                className="bg-amber-400 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-amber-500 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
