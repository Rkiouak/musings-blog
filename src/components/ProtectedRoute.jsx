// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CircularProgress, Box } from '@mui/material'; // Optional loading indicator

// You can pass children or use Outlet
// Using Outlet is generally preferred for layout routes
function ProtectedRoute({ children }) {
  const auth = useAuth();
  const location = useLocation(); // Get current location

  // Optional: Add a loading state if auth status is initially undetermined
  // For this simple example, we assume auth status is immediately known
  // if (auth.isLoading) {
  //    return <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh"><CircularProgress /></Box>;
  // }

  if (!auth.isAuthenticated) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to. This allows us to send them along to that page after they login,
    // which is a nicer user experience than dropping them off on the home page.
    console.log("Not authenticated, redirecting to login. Original location:", location);
    return <Navigate to="/login" state={{ from: location }} replace />;
    // 'replace' avoids adding the login route to the history stack
  }

  // If authenticated, render the child component or the Outlet
  return children ? children : <Outlet />;
}

export default ProtectedRoute;
