"use client"

import { Navigate, useLocation } from "react-router-dom"
import { useUser } from "@clerk/clerk-react"

const ProtectedRoute = ({ children }) => {
  const { isSignedIn, isLoaded } = useUser()
  const location = useLocation()

  // Show loading state while Clerk is initializing
  if (!isLoaded) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  // If user is not signed in, redirect to sign-in page
  if (!isSignedIn) {
    return <Navigate to="/sign-in" state={{ from: location.pathname }} replace />
  }

  // If user is signed in, render the protected content
  return children
}

export default ProtectedRoute