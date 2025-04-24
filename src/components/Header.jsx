// src/components/Header.jsx
import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import useAuth hook

function Header() {
  const auth = useAuth(); // Get auth state and functions

  return (
      <AppBar position="static">
        <Toolbar>
          {/* Logo */}
          <Box
              component="img"
              sx={{
                display: { xs: 'none', md: 'flex' },
                mr: 1, // Keep margin to separate logo from title/home group
                height: 60,
                width: 60,
                borderRadius: '50%',
                objectFit: 'cover',
              }}
              alt="logo"
              src={"/newfy.jpeg"}
          />

          {/* Group Title and Home Button */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h6" component="div" sx={{ mr: 2 }}> {/* Added margin-right to space title from Home */}
              <RouterLink to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                Musings
              </RouterLink>
            </Typography>
            <Button color="inherit" component={RouterLink} to="/">
              Home
            </Button>
            {/* Add other primary navigation links here if needed */}
          </Box>

          {/* Spacer */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Auth Buttons Container */}
          <Box> {/* Removed ml: 2 from here */}
            {auth.isAuthenticated ? (
                <Button color="inherit" onClick={auth.logout}>
                  Logout
                </Button>
            ) : (
                <>
                  <Button color="inherit" component={RouterLink} to="/login">
                    Login
                  </Button>
                  <Button
                      variant="contained"
                      color="secondary"
                      component={RouterLink}
                      to="/signup"
                      sx={{ ml: 1.5 }}
                  >
                    Sign Up
                  </Button>
                </>
            )}
          </Box>
          {/* <Button color="inherit" component={RouterLink} to="/about">About</Button> */}
        </Toolbar>
      </AppBar>
  );
}

export default Header;