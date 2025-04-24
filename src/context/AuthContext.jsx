// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);
const TOKEN_KEY = 'authToken'; // Key for localStorage

export function AuthProvider({ children }) {
  // Initialize state from localStorage if token exists
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  // Derive user state from token (initially just username, could decode JWT later)
  const [user, setUser] = useState(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    // Basic check: if token exists, assume user is logged in initially
    // A better approach might involve validating the token or decoding it
    return storedToken ? { username: 'User' } : null; // Placeholder username
  });
  const navigate = useNavigate();

  // Effect to update localStorage when token changes
  useEffect(() => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
      // You might want to fetch user details here based on the token
      // For now, we just set a basic user object
      setUser({ username: 'AuthenticatedUser' }); // Update user based on token presence
    } else {
      localStorage.removeItem(TOKEN_KEY);
      setUser(null); // Clear user when token is removed
    }
  }, [token]);

  // --- Login using API ---
  const login = async (username, password, from) => {
    const loginUrl = '/api/token';

    // Create FormData object
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    try {
      const response = await fetch(loginUrl, {
        method: 'POST',
        // ** Do NOT set Content-Type header when using FormData **
        // The browser sets it automatically with the correct boundary
        body: formData, // Send FormData object as body
      });

      if (!response.ok) {
        let errorMsg = `Login failed with status: ${response.status}`;
        try {
          // Try to get more specific error from response body
          const errorData = await response.json();
          errorMsg = errorData.detail || errorMsg;
        } catch (e) {
          // Ignore if response body isn't JSON or can't be parsed
        }
        throw new Error(errorMsg);
      }

      // Assuming the response contains { "access_token": "...", "token_type": "bearer" }
      const data = await response.json();

      if (data.access_token) {
        setToken(data.access_token); // Update token state (triggers useEffect)
        // User state will be set by the useEffect hook based on the new token
        // Navigate to the originally intended page or home after login
        navigate(from || '/', { replace: true });
        return { username: username }; // Return basic user info for now
      } else {
        throw new Error('Login successful, but no access token received.');
      }

    } catch (error) {
      console.error("Login API call failed:", error);
      // Re-throw the error so the LoginPage can display it
      throw error;
    }
  };

  // --- Logout ---
  const logout = () => {
    setToken(null); // Clear token state (triggers useEffect to clear localStorage and user)
    // Navigate to home page after logout
    navigate('/', { replace: true });
  };

  // Memoize the context value
  const value = useMemo(
      () => ({
        user,
        token, // Expose token if needed elsewhere (e.g., for API headers)
        isAuthenticated: !!token, // Authentication status based on token existence
        login,
        logout,
      }),
      [user, token] // Recalculate when user or token changes
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}