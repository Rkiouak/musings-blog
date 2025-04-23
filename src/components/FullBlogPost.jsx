// src/components/FullBlogPost.jsx
import React from 'react';
import { Box, Typography, Divider, Paper } from '@mui/material';

// Expects a 'post' object prop
function FullBlogPost({ post }) {
    if (!post) {
        return <Typography>Post not found.</Typography>;
    }

  return (
    <Paper elevation={2} sx={{ p: { xs: 2, md: 4 } }}> {/* Add padding */}
        <Typography variant="h4" component="h1" gutterBottom>
            {post.title}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            By {post.author} on {post.date}
        </Typography>
         {post.imageUrl && (
             <Box
                 component="img"
                 src={post.imageUrl}
                 alt={post.title}
                 sx={{
                     maxHeight: '200px', // Limit image height
                     objectFit: 'scale-down', // Cover the area nicely
                     mb: 3, // Margin bottom
                 }}
             />
         )}
        <Divider sx={{ my: 3 }} /> {/* Margin top & bottom */}
        {/* Render HTML content safely (basic example) */}
        {/* For production, consider using a sanitizer library like DOMPurify */}
        <Box dangerouslySetInnerHTML={{ __html: post.content }} />
    </Paper>
  );
}

export default FullBlogPost;
