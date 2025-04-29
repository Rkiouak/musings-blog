// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { Grid, Typography, Box, CircularProgress, Alert, Paper, Divider } from '@mui/material'; // Added Paper, Divider
import BlogPostPreview from '../components/BlogPostPreview';
import { useAuth } from '../context/AuthContext'; // Import useAuth

function HomePage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const { token, handleUnauthorized } = useAuth(); // Get token and handler

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            setError('');

            const headers = {
                'Accept': 'application/json',
            };
            if (token) { // Add Authorization header only if token exists
                headers['Authorization'] = `Bearer ${token}`;
            }

            try {
                const response = await fetch('/api/posts/', { headers });

                if (response.status === 401 || response.status === 403) {
                    console.warn("Received 401/403 fetching posts. Treating as potentially public endpoint.");
                    // Throw error to be caught below, or setPosts([]) etc.
                    throw new Error(`Unauthorized to fetch posts: ${response.status}`);
                }
                // --- End Check ---


                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setPosts(data);

            } catch (e) {
                console.error("Failed to fetch posts:", e);
                if (e.message.startsWith("Unauthorized")) {
                    setError("Could not fetch personalized posts. Viewing public content.");
                    setPosts([]);
                } else {
                    setError('Failed to load posts. Please try refreshing the page.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [token, handleUnauthorized]);

    return (
        <Box>
            <Paper elevation={1} sx={{ p: 3, mb: 4, textAlign: 'left' }}>
                <Typography variant="h5" component="h2" gutterBottom>
                    Welcome to Musings
                </Typography>
                <Typography variant="body1" paragraph>
                    This is a space for thoughts, reflections, and explorations. Basic blog platform clone WiP.
                    Will add post comments next.
                </Typography>
            </Paper>

            <Divider sx={{ mb: 4 }} /> {/* Optional divider */}

            <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
                Latest Posts
            </Typography>

            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
                    <CircularProgress />
                </Box>
            )}

            {error && (
                <Alert severity="error" sx={{ my: 3 }}>
                    {error}
                </Alert>
            )}

            {!loading && !error && (
                <Grid container spacing={4}>
                    {posts.length > 0 ? (
                        posts.map((post) => (
                            <Grid item key={post.id} xs={12} sm={6} md={4}>
                                <BlogPostPreview post={post} />
                            </Grid>
                        ))
                    ) : (
                        <Grid item xs={12}>
                            <Typography align="center">No posts available yet.</Typography>
                        </Grid>
                    )
                    }
                </Grid>
            )}
        </Box>
    );
}

export default HomePage;