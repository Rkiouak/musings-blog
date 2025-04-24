// src/pages/SignUpPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    Link as MuiLink
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

function SignUpPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [givenName, setGivenName] = useState(''); // <-- Add state for given name
    const [familyName, setFamilyName] = useState(''); // <-- Add state for family name
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');

        // Basic Validation
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }
        // Add checks for other required fields if necessary
        if (!givenName || !familyName) {
            setError('Please fill in your first and last name.');
            return;
        }


        setLoading(true);

        // --- API Call ---
        const signUpUrl = '/api/users/';
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
                    // Add other headers like Accept if needed
                    'Accept': 'application/json'
                },
                body: JSON.stringify(userData), // Send data as JSON string
            });

            if (!response.ok) {
                let errorMsg = `Sign up failed with status: ${response.status}`;
                try {
                    // Try to get more specific error from response body
                    const errorData = await response.json();
                    // Adjust based on your API's error response structure
                    errorMsg = errorData.detail || errorData.message || errorMsg;
                } catch (e) {
                    // Ignore if response body isn't JSON or can't be parsed
                    errorMsg = `${errorMsg}. Could not parse error details.`;
                }
                throw new Error(errorMsg);
            }

            // Assuming successful signup returns status 200/201
            // Optionally parse the response if it contains useful data
            // const result = await response.json();
            // console.log('Sign up successful:', result);

            // Redirect to login page with a success message
            navigate('/login?signup=success');

        } catch (err) {
            console.error("Sign up API call failed:", err);
            setError(err.message || 'Sign up failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={3} sx={{ marginTop: 8, padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5">
                    Sign Up
                </Typography>
                {error && <Alert severity="error" sx={{ width: '100%', mt: 2 }}>{error}</Alert>}
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
                    {/* Add Fields for Given Name and Family Name */}
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
                        // autoFocus // Removed autoFocus to avoid jumping past name fields
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
                        error={!!error && password !== confirmPassword}
                        helperText={error && password !== confirmPassword ? "Passwords do not match" : ""}
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
        </Container>
    );
}

export default SignUpPage;