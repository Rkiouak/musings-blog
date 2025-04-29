// src/pages/PostDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import FullBlogPost from '../components/FullBlogPost';
import { Typography, CircularProgress, Alert, Box } from '@mui/material'; // Added CircularProgress, Alert, Box
import { useAuth } from '../context/AuthContext'; // Import useAuth to potentially get token

// Remove the static import: import postsData from '../posts.json';

function PostDetailPage() {
  const { postId } = useParams(); // Get the 'postId' from the URL
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token, handleUnauthorized } = useAuth(); // Get token and unauthorized handler

  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) return; // Don't fetch if postId is missing

      setLoading(true);
      setError('');

      // --- Decide if auth is needed ---
      // If your /api/posts/{id} endpoint requires authentication:
      const headers = {
        'Accept': 'application/json',
      };
      if (token) { // Add Authorization header only if token exists
        headers['Authorization'] = `Bearer ${token}`;
      }
      // If the endpoint is public, you can remove the token logic and just use:
      // const headers = { 'Accept': 'application/json' };
      // --- End Auth Decision ---


      try {
        const response = await fetch(`/api/posts/${postId}`, { headers }); // Use postId in URL

        // --- Add 401/403 Check ---
        if (response.status === 401 || response.status === 403) {
          handleUnauthorized(); // Use the handler from context
          throw new Error("Unauthorized access to post.");
        }
        // --- End Check ---

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Post not found.');
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPost(data); // Assuming the API returns the post object directly
      } catch (e) {
        console.error("Failed to fetch post:", e);
        // Only set error if it's not the handled auth/not found error
        if (e.message !== "Unauthorized access to post.") {
          setError(e.message || 'Failed to load post.');
        }
        // Otherwise, navigation or specific state is handled elsewhere
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
    // Depend on postId, token, and handleUnauthorized
  }, [postId, token, handleUnauthorized]);

  if (loading) {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
          <CircularProgress />
        </Box>
    );
  }

  if (error) {
    return (
        // Display specific message for 'Post not found' error
        error === 'Post not found.' ?
            <Typography variant="h5" align="center" sx={{ mt: 5 }}>Post not found!</Typography>
            : <Alert severity="error" sx={{ my: 3 }}>{error}</Alert>
    );
  }

  // FullBlogPost expects a post object, it will render "Post not found" if post is null.
  // However, we handle the null/error case above for better feedback during loading/error states.
  return <FullBlogPost post={post} />;
}

export default PostDetailPage;