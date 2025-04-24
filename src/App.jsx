// src/App.jsx
import React from 'react';
import {Routes, Route} from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import PostDetailPage from './pages/PostDetailPage';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import SignUpPage from './pages/SignUpPage';


function App() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage/>}/>
            <Route path="/" element={<Layout/>}><Route path="/signup" element={<SignUpPage />} />
                <Route index element={<HomePage/>}/> {/* index route for '/' */}
                <Route element={<ProtectedRoute/>}>
                    <Route path="post/:postId" element={<PostDetailPage/>}/>
                </Route>
            </Route>

            {/* Catch-all route for 404 Not Found */}
            {/* This should be outside the Layout route or also wrapped if you want the 404 page to have the layout */}
            <Route path="*" element={<Layout><NotFoundPage/></Layout>}/> {/* Option: Wrap 404 in Layout */}
            {/* <Route path="*" element={<NotFoundPage />} /> */} {/* Option: Standalone 404 */}

        </Routes>
    );
}

export default App;
