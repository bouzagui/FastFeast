// import { useState } from 'react';
import Layout from "./components/layout";
import HomePage from "./pages/HomePage";
import Restaurants from "./pages/RestaurantsPage";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MenuPage from "./pages/MenuPage/";
import AboutPage from "./components/About/AboutPage";
import FAQSection from "./components/FAQ/FAQPage";
import ContactPage from "./components/Contact/ContactPage";
import TermsConditions from "./components/TermsConditions/TermsConditions";
import PrivacyPolicy from "./components/PrivacyPolicy/PrivacyPolicy";
import CookiesPolicy from "./components/CookiesPolicy/CookiesPolicy";


const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const frontEnd = import.meta.env.VITE_CLERK_FRONTEND_API
if (!clerkKey || !frontEnd) {
  throw new Error("Missing Clerk Publishable Key. Check your .env file.");
}


function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/MenuPage/:id" element={<MenuPage />} />
          <Route path="/aboutPage" element={<AboutPage />} />
          <Route path="/FAQPage" element={<FAQSection />} />
          <Route path="/ContactPage" element={<ContactPage />} />
          <Route path="/TermsConditions" element={<TermsConditions />} />
          <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
          <Route path="/CookiesPolicy" element={<CookiesPolicy />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
