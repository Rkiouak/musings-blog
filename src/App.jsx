// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout'; // Import the Layout
import HomePage from './pages/HomePage';
import PostDetailPage from './pages/PostDetailPage';
import NotFoundPage from './pages/NotFoundPage';
// import AboutPage from './pages/AboutPage'; // Uncomment if you create an About page

function App() {
  return (
    <Routes>
      {/* Routes that use the Layout (Header/Footer) */}
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} /> {/* index route for '/' */}
        <Route path="post/:postId" element={<PostDetailPage />} />
        {/* <Route path="about" element={<AboutPage />} /> */}
        {/* Add other pages that need the layout here */}
      </Route>

      {/* Catch-all route for 404 Not Found */}
      {/* This should be outside the Layout route or also wrapped if you want the 404 page to have the layout */}
      <Route path="*" element={<Layout><NotFoundPage /></Layout>} /> {/* Option: Wrap 404 in Layout */}
      {/* <Route path="*" element={<NotFoundPage />} /> */} {/* Option: Standalone 404 */}

    </Routes>
  );
}

export default App;
