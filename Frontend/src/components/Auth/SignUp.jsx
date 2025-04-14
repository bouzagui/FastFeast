"use client"

import { useState } from "react"
import { useAuth } from "../../context/AuthProvider"
import { useNavigate, Link } from "react-router-dom"

export default function SignUp() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const { signup } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError("")

    // Basic validation
    if (!email || !password || !name) {
      setError("All fields are required")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    // In a real app, you would send registration data to your backend
    // For now, we'll just simulate a successful registration
    const success = signup({ id: Date.now().toString(), email, name })

    if (success) {
      navigate("/")
    } else {
      setError("Registration failed")
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Your Name"
          />
        </div>

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

        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="••••••••"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium">Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="••••••••"
          />
        </div>

        <button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700">
          Sign Up
        </button>
      </form>

      <div className="mt-4 text-center">
        <p>
          Already have an account?{" "}
          <Link to="/sign-in" className="text-blue-600 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}

