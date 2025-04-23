// src/components/Layout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import Header from './Header';
import Footer from './Footer';

function Layout() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      {/* Main content area */}
      <Container component="main" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
         {/* Outlet renders the matched child route component */}
        <Outlet />
      </Container>
      <Footer />
    </Box>
  );
}

export default Layout;
