// src/pages/LoginPage.jsx
import React, { useState, useEffect } from 'react'; // <-- Import useEffect
import { useLocation, useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert, // Keep Alert for login errors
  CircularProgress,
  Grid,
  Link as MuiLink,
  Snackbar // <-- Import Snackbar
} from '@mui/material';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false); // <-- State for Snackbar visibility
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();

  const from = location.state?.from?.pathname || '/';

  // Check for signup success on component mount and location change
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('signup') === 'success') {
      setShowSuccessToast(true);
      // Optional: Clean the URL query parameter after showing the toast
      // navigate(location.pathname, { replace: true });
    }
  }, [location]); // <-- Dependency array includes location

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await auth.login(username, password, from);
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
    setShowSuccessToast(false);
  };

  return (
      <Container component="main" maxWidth="xs">
        <Paper elevation={3} sx={{ marginTop: 8, padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          {/* Keep Alert only for login errors */}
          {error && <Alert severity="error" sx={{ width: '100%', mt: 2 }}>{error}</Alert>}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
            {/* ... (TextFields for username and password remain the same) ... */}
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

        {/* Snackbar for Success Message */}
        <Snackbar
            open={showSuccessToast}
            autoHideDuration={6000} // Hide after 6 seconds
            onClose={handleCloseToast}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} // Position
        >
          {/* Use Alert inside Snackbar for consistent styling */}
          <Alert onClose={handleCloseToast} severity="success" variant="filled" sx={{ width: '100%' }}>
            Sign up successful! Please sign in.
          </Alert>
        </Snackbar>
      </Container>
  );
}

export default LoginPage;
