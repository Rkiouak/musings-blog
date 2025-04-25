import React, { useState } from 'react';
// Remove useNavigate if no longer needed after signup
// import { useNavigate } from 'react-router-dom';
import {
    Container,
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    Alert,
    CircularProgress,
    Grid,
    Link as MuiLink,
    Snackbar // Import Snackbar for toast messages
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

function SignUpPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [givenName, setGivenName] = useState('');
    const [familyName, setFamilyName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showSuccessToast, setShowSuccessToast] = useState(false); // State for success toast
    // const navigate = useNavigate(); // Comment out or remove if not navigating

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setShowSuccessToast(false); // Reset toast state on new submission

        // Basic Validation
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }
        if (!givenName || !familyName) {
            setError('Please fill in your first and last name.');
            return;
        }
        if (!username || !email) {
            setError('Please fill in username and email.');
            return;
        }


        setLoading(true);

        // --- API Call ---
        // Update the API endpoint to /api/challenge/
        const signUpUrl = '/api/challenge/'; // <--- UPDATED ENDPOINT
        const userData = {
            username: username,
            email: email,
            given_name: givenName,
            family_name: familyName,
            password: password
        };

        try {
            const response = await fetch(signUpUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                let errorMsg = `Sign up failed with status: ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorMsg = errorData.detail || errorData.message || errorMsg;
                } catch (e) {
                    errorMsg = `${errorMsg}. Could not parse error details.`;
                }
                throw new Error(errorMsg);
            }

            // --- SUCCESS HANDLING ---
            // Instead of navigating, show the success toast
            setShowSuccessToast(true); // <--- SHOW SUCCESS TOAST
            // navigate('/login?signup=success'); // <--- REMOVED NAVIGATION

            // Optionally clear the form fields after successful submission
            // setUsername('');
            // setEmail('');
            // setGivenName('');
            // setFamilyName('');
            // setPassword('');
            // setConfirmPassword('');


        } catch (err) {
            console.error("Sign up API call failed:", err);
            setError(err.message || 'Sign up failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Snackbar close handler
    const handleCloseToast = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setShowSuccessToast(false);
    };

    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={3} sx={{ marginTop: 8, padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5">
                    Sign Up
                </Typography>
                {/* Display general errors */}
                {error && !showSuccessToast && <Alert severity="error" sx={{ width: '100%', mt: 2 }}>{error}</Alert>}
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
                    {/* Form Fields (Grid, TextFields for names, username, email, passwords) */}
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="givenName"
                                label="First Name"
                                name="givenName"
                                autoComplete="given-name"
                                value={givenName}
                                onChange={(e) => setGivenName(e.target.value)}
                                disabled={loading}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="familyName"
                                label="Last Name"
                                name="familyName"
                                autoComplete="family-name"
                                value={familyName}
                                onChange={(e) => setFamilyName(e.target.value)}
                                disabled={loading}
                            />
                        </Grid>
                    </Grid>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        autoComplete="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        disabled={loading}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        id="confirmPassword"
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={loading}
                        // Show error specifically for password mismatch, separate from general error
                        error={!!error && error.includes('Passwords do not match')}
                        helperText={error && error.includes('Passwords do not match') ? "Passwords do not match" : ""}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign Up'}
                    </Button>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <MuiLink component={RouterLink} to="/login" variant="body2">
                                Already have an account? Sign in
                            </MuiLink>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>

            {/* Snackbar for Success Toast */}
            <Snackbar
                open={showSuccessToast}
                autoHideDuration={6000} // Hide after 6 seconds
                onClose={handleCloseToast}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseToast} severity="success" variant="filled" sx={{ width: '100%' }}>
                    Please check your email to complete the sign up process!
                </Alert>
            </Snackbar>
        </Container>
    );
}

export default SignUpPage;