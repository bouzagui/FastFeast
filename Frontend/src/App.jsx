// import { useState } from 'react';
import HomePage from "./pages/HomePage";
import Restaurants from "./pages/RestaurantsPage";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkKey) {
  throw new Error("Missing Clerk Publishable Key. Check your .env file.");
}


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/restaurants" element={<Restaurants />} />
      </Routes>
    </Router>
  )
}

export default App
