"use client"

import { useState } from "react"
import { useSignIn } from "@clerk/clerk-react"
import { useNavigate, Link, useLocation } from "react-router-dom"

export default function SignIn() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { signIn, isLoaded: clerkLoaded } = useSignIn()
  const navigate = useNavigate()
  const location = useLocation()
  
  // Get the redirect path from the location state, or default to homepage
  const from = location.state?.from || "/"

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Basic validation
    if (!email || !password) {
      setError("Email and password are required")
      setIsLoading(false)
      return
    }

    if (!clerkLoaded) {
      setError("Authentication system is loading. Please try again.")
      setIsLoading(false)
      return
    }

    try {
      // Attempt to sign in with Clerk
      const result = await signIn.create({
        identifier: email,
        password,
      })

      if (result.status === "complete") {
        // Redirect to the page they were trying to access, or home
        navigate(from, { replace: true })
      } else {
        // Handle other statuses (e.g., needs two-factor, etc.)
        setError("Something went wrong. Please try again.")
      }
    } catch (err) {
      console.error("Sign in error:", err)
      setError("Invalid credentials or authentication error")
    } finally {
      setIsLoading(false)
    }
  }

  // Skip button to allow browsing without authentication
  const handleSkip = () => {
    navigate("/")
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="your@email.com"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="••••••••"
          />
        </div>

        <button 
          type="submit" 
          className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <div className="mt-4 text-center">
        <p>
          Don't have an account?{" "}
          <Link to="/sign-up" className="text-blue-600 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
      
      <div className="mt-6 text-center">
        <button 
          onClick={handleSkip} 
          className="py-2 px-4 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
        >
          Continue as Guest
        </button>
      </div>
    </div>
  )
}
