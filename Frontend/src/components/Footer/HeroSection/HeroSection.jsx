// import React, { useState, useEffect } from "react";
// import LocationDetector from "../../LocationDetector";
// import { useNavigate } from "react-router-dom";

// const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// export default function HeroSection() {
//   const navigate = useNavigate();
//   const [location, setLocation] = useState(() => {
//     const storedLocation = localStorage.getItem("userlocation");
//     return storedLocation ? JSON.parse(storedLocation) : null;
//   });

//   const [address, setAddress] = useState("");

//   useEffect(() => {
//     if (location) {
//       fetchAddress(location.latitude, location.longitude);
//     }
//   }, [location]);


//   const fetchAddress = async (lat, lng) => {
//     try {
//       const response = await fetch(
//         `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`
//       );
//       const data = await response.json();
//       if (data.status === "OK" && data.results.length > 0) {
//         setAddress(data.results[0].formatted_address);
//       } else {
//         setAddress("Address not found");
//       }
//     } catch (error) {
//       console.error("Error fetching address:", error);
//       setAddress("Error fetching address");
//     }
//   };

//   const handleLocationChange = (newLocation) => {
//     setLocation(newLocation);
//     localStorage.setItem("userlocation", JSON.stringify(newLocation));
//     fetchAddress(newLocation.latitude, newLocation.longitude); // Fetch address when location updates
//     navigate("/restaurants");
//   };

//   return (
//     <div className="bg-gradient-to-r from-indigo-500 to-teal-400 m-0 p-0">
//       <main>
//         <div className="w-full h-28 flex justify-center items-end">
//           <input
//             name="myInput"
//             className="bg-white pl-2 w-full max-w-md py-2 border-3 hover:border-2 border-amber-400 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-400"
//             placeholder="Add your address"
//             value={address || "Fetching address..."} // Show formatted address
//             readOnly
//           />
//         </div>

//         <div className="w-full flex justify-center mt-4">
//           <LocationDetector onLocationDetect={handleLocationChange} />
//         </div>
//       </main>
//     </div>
//   );
// }


import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Search, MapPin, ArrowRight } from "lucide-react"
import LocationDetector from "../../LocationDetector"
import useNearbyRestaurants from "../../../hooks/useNearbyRestaurants"

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

export default function HeroSection() {
  const navigate = useNavigate()
  const { userAddress, location: nearbyLocation } = useNearbyRestaurants()
  const [searchQuery, setSearchQuery] = useState("")
  const [location, setLocation] = useState(() => {
    const storedLocation = localStorage.getItem("userlocation")
    return storedLocation ? JSON.parse(storedLocation) : null
  })
  const [address, setAddress] = useState("")
  const [isLoadingAddress, setIsLoadingAddress] = useState(false)

  useEffect(() => {
    if (location) {
      fetchAddress(location.latitude, location.longitude)
    }
  }, [location])

  const fetchAddress = async (lat, lng) => {
    setIsLoadingAddress(true)
    try {
      if (!GOOGLE_MAPS_API_KEY) {
        // Fallback to OpenStreetMap if API key is not available
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
        const data = await response.json()
        setAddress(data.display_name || "Address not found")
      } else {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`,
        )
        const data = await response.json()
        if (data.status === "OK" && data.results.length > 0) {
          setAddress(data.results[0].formatted_address)
        } else {
          setAddress("Address not found")
        }
      }
    } catch (error) {
      console.error("Error fetching address:", error)
      setAddress("Error fetching address")
    } finally {
      setIsLoadingAddress(false)
    }
  }

  const handleLocationChange = (newLocation) => {
    console.log("Location detected:", newLocation)
    setLocation(newLocation)
    localStorage.setItem("userlocation", JSON.stringify(newLocation))
    fetchAddress(newLocation.latitude, newLocation.longitude)
    // Optional: add a small delay before navigating to allow address to be fetched
    setTimeout(() => navigate("/restaurants"), 500)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    navigate(`/restaurants?search=${searchQuery}`)
  }

  const displayAddress = userAddress || address || (location ? "Getting address..." : "No location set")

  return (
    <div className="relative bg-gradient-to-b from-amber-400 to-amber-500 pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=1600')] bg-cover bg-center opacity-10"></div>
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-yellow-300 rounded-full opacity-50 blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-amber-300 rounded-full opacity-40 blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
            Delicious Food, <br className="hidden sm:block" />
            <span className="text-white drop-shadow-sm">Delivered to Your Door</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-800 mb-10 max-w-3xl mx-auto font-medium">
            Order from your favorite restaurants and enjoy the best meals without leaving home.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-3xl mx-auto mb-10">
          <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row shadow-xl rounded-xl overflow-hidden bg-white/95 backdrop-blur-sm"
          >
            <div className="flex-1 flex items-center bg-white px-5 py-4 border-b sm:border-b-0 sm:border-r border-gray-100">
              <Search className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search for restaurants or cuisines..."
                className="w-full outline-none text-gray-700 bg-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center bg-white px-5 py-4 border-b sm:border-b-0 sm:border-r border-gray-100">              
              <LocationDetector onLocationDetect={handleLocationChange} />
            </div>
            <div className="flex justify-center mt-4">
            </div>
            <button
              type="submit"
              className="bg-gray-900 text-white px-8 py-4 font-bold hover:bg-gray-800 transition-colors"
            >
              Search
            </button>
          </form>

          
        </div>

        {/* CTA Buttons
        <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
          <button
            onClick={() => navigate("/restaurants")}
            className="bg-gray-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-gray-800 transition-colors flex items-center justify-center shadow-lg"
          >
            Browse Restaurants <ArrowRight className="ml-2 h-5 w-5" />
          </button>
          <button
            onClick={() => navigate("/aboutPage")}
            className="bg-white text-gray-900 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-colors shadow-md border-2 border-gray-200"
          >
            Learn More
          </button>
        </div> */}
      </div>
    </div>
  )
}