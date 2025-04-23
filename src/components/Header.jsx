// src/components/Header.jsx
import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom'; // Alias Link to avoid conflicts

function Header() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Box
            component="img"
            sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, height: 60, objectFit: 'scale-down' }}
            alt="logo"
            src={"newfy.jpeg"}
        />

        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <RouterLink to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            Musings
          </RouterLink>
        </Typography>
        <Box>
          <Button color="inherit" component={RouterLink} to="/">
            Home
          </Button>
          {/* Add other links like About if needed */}
          {/* <Button color="inherit" component={RouterLink} to="/about">About</Button> */}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
