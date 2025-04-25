// src/pages/LoginPage.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
  Snackbar // Keep Snackbar import
} from '@mui/material';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  // --- MODIFICATION: Use state for toast message and visibility ---
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState('success'); // Default to success
  // --- END MODIFICATION ---
  const navigate = useNavigate();
  const location = useLocation(); // Keep location hook
  const auth = useAuth();

  const from = location.state?.from?.pathname || '/';

  // --- MODIFICATION: Consolidate useEffect for showing toasts ---
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const signupSuccess = params.get('signup') === 'success';
    const validationSuccess = location.state?.validationSuccess; // Check state

    let message = '';
    let severity = 'success';

    if (validationSuccess) {
      message = 'Thank you for signing up! Please sign in with your new credentials.';
      // Clear the state after reading it to prevent the message
      // from showing again on subsequent renders/navigations within the login page.
      navigate(location.pathname, { replace: true, state: {} });
    } else if (signupSuccess) {
      // Existing message from signup page (might be redundant if validation page is always used)
      message = 'Sign up initiated! Please check your email or sign in if validation complete.';
      // Optional: Clean the URL query parameter
      // navigate(location.pathname, { replace: true });
    }

    if (message) {
      setToastMessage(message);
      setToastSeverity(severity);
      setToastOpen(true);
    }

    // Add navigate to dependency array as it's used to clear state
  }, [location.search, location.state, navigate]);
  // --- END MODIFICATION ---


  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await auth.login(username, password, from);
      // Login handles navigation on success internally
    } catch (err) {
      console.error("Login failed:", err);
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Snackbar close handler
  const handleCloseToast = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setToastOpen(false); // Use the state setter
  };

  // --- UI remains largely the same, just update Snackbar props ---
  return (
      <Container component="main" maxWidth="xs">
        <Paper elevation={3} sx={{ marginTop: 8, padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          {error && <Alert severity="error" sx={{ width: '100%', mt: 2 }}>{error}</Alert>}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
            <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
            />
            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <MuiLink component={RouterLink} to="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </MuiLink>
              </Grid>
            </Grid>
          </Box>
        </Paper>

        {/* --- MODIFICATION: Updated Snackbar --- */}
        <Snackbar
            open={toastOpen}
            autoHideDuration={6000}
            onClose={handleCloseToast}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseToast} severity={toastSeverity} variant="filled" sx={{ width: '100%' }}>
            {toastMessage}
          </Alert>
        </Snackbar>
        {/* --- END MODIFICATION --- */}
      </Container>
  );
}

export default LoginPage;