import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer/Footer";

export default function layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
