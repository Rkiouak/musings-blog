// src/pages/ValidateUserPage.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Box, Typography, CircularProgress, Alert, Paper } from '@mui/material';

function ValidateUserPage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const challengeToken = params.get('challenge');

        if (!challengeToken) {
            setError('Challenge token missing from URL.');
            setLoading(false);
            return;
        }

        const validateUser = async () => {
            setLoading(true);
            setError('');
            const validateUrl = '/users/'; // Adjust if needed

            try {
                const response = await fetch(validateUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify({ challenge: challengeToken }),
                });

                if (!response.ok) {
                    let errorMsg = `Validation failed with status: ${response.status}`;
                    try {
                        const errorData = await response.json();
                        errorMsg = errorData.detail || errorData.message || errorMsg;
                    } catch (e) {
                        // Keep the generic status message
                    }
                    throw new Error(errorMsg);
                }

                // On successful POST, navigate to login WITH state
                console.log('Validation successful, navigating to login with state.');
                // --- MODIFICATION ---
                navigate('/login', { state: { validationSuccess: true } });
                // --- END MODIFICATION ---

            } catch (err) {
                console.error("User validation API call failed:", err);
                setError(err.message || 'Validation failed. Please try again or contact support.');
                setLoading(false);
            }
        };

        validateUser();

    }, [location, navigate]);

    // --- UI remains the same ---
    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={3} sx={{ marginTop: 8, padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
                    Validating Account
                </Typography>
                {loading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                        <CircularProgress />
                    </Box>
                )}
                {error && (
                    <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
                        {error}
                    </Alert>
                )}
                {!loading && !error && (
                    <Typography variant="body1" sx={{ mt: 2 }}>
                        Validation successful. Redirecting...
                    </Typography>
                )}
                {!loading && error && (
                    <Typography variant="body2" sx={{ mt: 2 }}>
                        If the problem persists, please contact support.
                    </Typography>
                )}
            </Paper>
        </Container>
    );
}

export default ValidateUserPage;