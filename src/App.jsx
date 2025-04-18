// App.jsx
import Layout from "./components/layout";
import { Routes, Route } from 'react-router-dom';

import HomePage from "./pages/HomePage";
import Restaurants from "./pages/RestaurantsPage";
import MenuPage from "./pages/MenuPage/";
import OrderConfirmation from "./pages/OrderConfirmation";
import CheckoutPage from "./pages/checkoutPage";

// Footer Pages
import AboutPage from "./components/Footer/About/AboutPage";
import FAQSection from "./components/Footer/FAQ/FAQPage";
import ContactPage from "./components/Footer/Contact/ContactPage";
import TermsConditions from "./components/Footer/TermsConditions/TermsConditions";
import PrivacyPolicy from "./components/Footer/PrivacyPolicy/PrivacyPolicy";
import CookiesPolicy from "./components/Footer/CookiesPolicy/CookiesPolicy";

// Context
import { CartProvider } from "./context/CartProvider";

// Clerk
import { SignIn, SignUp, SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";

function App() {
  return (
    <CartProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/Menu/:id" element={<MenuPage />} />
          <Route path="/signIn" element={<SignIn routing="path" path="/signIn" />} />
          <Route path="/signUp" element={<SignUp routing="path" path="/signUp" />} />
          
          <Route
            path="/checkout"
            element={
              <>
                <SignedIn>
                  <CheckoutPage />
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            }
          />

          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/aboutPage" element={<AboutPage />} />
          <Route path="/FAQPage" element={<FAQSection />} />
          <Route path="/ContactPage" element={<ContactPage />} />
          <Route path="/TermsConditions" element={<TermsConditions />} />
          <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
          <Route path="/CookiesPolicy" element={<CookiesPolicy />} />
        </Route>
      </Routes>
    </CartProvider>
  );
}

export default App;
