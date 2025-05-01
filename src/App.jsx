// src/App.jsx
import React, { Suspense, lazy } from 'react'; // Import Suspense and lazy
import { Routes, Route } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material'; // Import for fallback UI
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import PostDetailPage from './pages/PostDetailPage';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import SignUpPage from './pages/SignUpPage';
import ValidateUserPage from "./pages/ValidateUserPage.jsx";
import ProfilePage from './pages/ProfilePage';

// --- Lazy load CreatePostPage ---
const CreatePostPage = lazy(() => import('./pages/CreatePostPage'));
// --- End Lazy load ---

// --- Fallback component for Suspense ---
function LoadingFallback() {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
            <CircularProgress />
        </Box>
    );
}
// --- End Fallback ---

function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                {/* Public Routes */}
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/users/validate" element={<ValidateUserPage />} />
                <Route index element={<HomePage />} /> {/* index route for '/' */}
                <Route path="post/:postId" element={<PostDetailPage />} />
                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>
                    <Route path="profile" element={<ProfilePage />} />
                    {/* --- Use Suspense for the lazy-loaded route --- */}
                    <Route
                        path="create-post"
                        element={
                            <Suspense fallback={<LoadingFallback />}>
                                <CreatePostPage />
                            </Suspense>
                        }
                    />
                    {/* --- End Suspense --- */}
                </Route>
            </Route>

            {/* Catch-all route for 404 Not Found */}
            <Route path="*" element={<Layout><NotFoundPage /></Layout>} />

        </Routes>
    );
}

export default App;