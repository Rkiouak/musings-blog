// src/pages/HomePage.jsx
import React from 'react';
import { Grid, Typography, Box } from '@mui/material';
import BlogPostPreview from '../components/BlogPostPreview';
import postsData from '../posts.json'; // Import the data

function HomePage() {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
        Latest Posts
      </Typography>
      <Grid container spacing={4}> {/* Grid container */}
        {postsData.map((post) => (
          <Grid item key={post.id} xs={12} sm={6} md={4}> {/* Grid item for responsiveness */}
            <BlogPostPreview post={post} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default HomePage;
