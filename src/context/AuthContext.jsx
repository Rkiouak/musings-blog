// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Keep useNavigate

const AuthContext = createContext(null);
const TOKEN_KEY = 'authToken';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    return storedToken ? { username: 'User' } : null;
  });
  const navigate = useNavigate(); // useNavigate hook

  useEffect(() => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
      setUser({ username: 'AuthenticatedUser' });
    } else {
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
    }
  }, [token]);

  // --- Centralized Logout/Redirect Function ---
  const handleUnauthorized = () => {
    console.log("Unauthorized (401/403). Redirecting to login.");
    setToken(null); // Clear token immediately
    navigate('/login', { replace: true, state: { sessionExpired: true } }); // Redirect to login
  };
  // --- End Centralized Logout ---


  // --- Modify Login ---
  const login = async (username, password, from) => {
    const loginUrl = '/api/token';
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    try {
      const response = await fetch(loginUrl, {
        method: 'POST',
        body: formData,
      });

      // --- Add 401/403 Check ---
      if (response.status === 401 || response.status === 403) {
        handleUnauthorized(); // Use the centralized handler
        // Throw an error to prevent further execution in this try block
        throw new Error('Authentication failed.');
      }
      // --- End Check ---


      if (!response.ok) {
        let errorMsg = `Login failed with status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMsg = errorData.detail || errorMsg;
        } catch (e) { /* Ignore */ }
        throw new Error(errorMsg);
      }

      const data = await response.json();

      if (data.access_token) {
        setToken(data.access_token);
        navigate(from || '/', { replace: true });
        return { username: username };
      } else {
        throw new Error('Login successful, but no access token received.');
      }

    } catch (error) {
      console.error("Login API call failed:", error);
      // Only re-throw if it's not the auth error we handled
      if (error.message !== 'Authentication failed.') {
        throw error;
      }
      // Otherwise, the handleUnauthorized function already navigated.
      // We might want to return something specific or just let it end.
      return null; // Or handle as appropriate
    }
  };

  // --- Modify Logout ---
  // Ensure logout clears token and navigates appropriately
  const logout = () => {
    setToken(null);
    navigate('/', { replace: true }); // Or navigate('/login') if preferred on manual logout
  };


  const value = useMemo(
      () => ({
        user,
        token,
        isAuthenticated: !!token,
        login,
        logout,
        // Expose the handler if needed elsewhere, or create a dedicated API fetch wrapper
        handleUnauthorized,
      }),
      [user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}