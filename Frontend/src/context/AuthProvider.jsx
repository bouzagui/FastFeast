import { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const { isSignedIn, isLoaded, user } = useUser();
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null,
    isLoading: true
  });

  // Sync Clerk authentication state with our context
  useEffect(() => {
    if (isLoaded) {
      setAuthState({
        isAuthenticated: isSignedIn || false,
        user: user || null,
        isLoading: false
      });
    }
  }, [isSignedIn, isLoaded, user]);

  // These functions are simplified since Clerk handles the actual auth
  // They're maintained for compatibility with your existing code
  const login = () => {
    // Clerk handles actual login - this is just for compatibility
    return isSignedIn;
  };

  const signup = () => {
    // Clerk handles actual signup - this is just for compatibility
    return isSignedIn;
  };

  const logout = () => {
    // Clerk handles actual logout - this is just for compatibility
    return true;
  };

  const value = {
    isAuthenticated: authState.isAuthenticated,
    user: authState.user,
    isLoading: authState.isLoading,
    login,
    signup,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
