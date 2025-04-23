// src/pages/PostDetailPage.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import FullBlogPost from '../components/FullBlogPost';
import postsData from '../posts.json'; // Import the data
import { Typography } from '@mui/material';

function PostDetailPage() {
  const { postId } = useParams(); // Get the 'postId' from the URL
  const post = postsData.find((p) => p.id === postId); // Find the post by ID

  if (!post) {
      // Handle case where post is not found
      return <Typography variant="h5" align="center" sx={{ mt: 5 }}>Post not found!</Typography>;
  }

  return <FullBlogPost post={post} />;
}

export default PostDetailPage;
