// src/pages/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; // Import useAuth
import { Container, Box, Typography, Paper, CircularProgress, Alert } from '@mui/material';
// Removed useNavigate as handleUnauthorized from context will handle it

function ProfilePage() {
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { token, handleUnauthorized } = useAuth(); // Get handleUnauthorized from context

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            setError('');
            const profileUrl = '/api/users/me/';

            if (!token) {
                setError('Not authenticated.');
                setLoading(false);
                // Optionally call handleUnauthorized here too if a missing token
                // implies an expired session that wasn't caught by an API call yet.
                // handleUnauthorized();
                return;
            }

            try {
                const response = await fetch(profileUrl, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    },
                });

                // --- Add 401/403 Check ---
                if (response.status === 401 || response.status === 403) {
                    handleUnauthorized(); // Use the handler from context
                    // Throw an error or return early to stop processing
                    throw new Error("Unauthorized access to profile.");
                }
                // --- End Check ---


                if (!response.ok) {
                    let errorMsg = `Failed to fetch profile: ${response.status}`;
                    try {
                        const errorData = await response.json();
                        errorMsg = errorData.detail || errorData.message || errorMsg;
                    } catch (e) { /* Ignore */ }
                    throw new Error(errorMsg);
                }

                const data = await response.json();
                setUserProfile(data);

            } catch (err) {
                console.error("Fetch profile API call failed:", err);
                // Only set error if it's not the handled auth error
                if (err.message !== "Unauthorized access to profile.") {
                    setError(err.message || 'Could not load profile data.');
                }
                // Otherwise, navigation is handled by handleUnauthorized
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
        // Add handleUnauthorized to dependency array
    }, [token, handleUnauthorized]);

    // ... rest of the component remains the same ...

    return (
        <Container component="main" maxWidth="sm">
            <Paper elevation={3} sx={{ marginTop: 8, padding: 4 }}>
                <Typography component="h1" variant="h4" align="center" gutterBottom>
                    User Profile
                </Typography>
                {loading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
                        <CircularProgress />
                    </Box>
                )}
                {error && (
                    <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
                        {error}
                    </Alert>
                )}
                {!loading && !error && userProfile && (
                    <Box sx={{ mt: 3 }}>
                        <Typography variant="h6" gutterBottom><strong>Username:</strong> {userProfile.username}</Typography>
                        <Typography variant="body1" gutterBottom><strong>Email:</strong> {userProfile.email}</Typography>
                        <Typography variant="body1" gutterBottom><strong>First Name:</strong> {userProfile.given_name}</Typography>
                        <Typography variant="body1" gutterBottom><strong>Last Name:</strong> {userProfile.family_name}</Typography>
                        {/* Add more fields as needed */}
                    </Box>
                )}
                {!loading && !error && !userProfile && (
                    // Check if an error message exists before showing this generic one
                    !error && <Typography align="center" sx={{ mt: 2 }}>Could not load profile data.</Typography>
                )}
            </Paper>
        </Container>
    );
}

export default ProfilePage;