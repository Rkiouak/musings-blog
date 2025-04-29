// src/pages/CreatePostPage.jsx
import React, { useState, useCallback } from 'react';
import {
    Container, Box, TextField, Button, Typography, Paper,
    CircularProgress, Alert, Switch, FormControlLabel, Input
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ReactMarkdown from 'react-markdown'; // Added import

function CreatePostPage() {
    const [title, setTitle] = useState('');
    const [snippet, setSnippet] = useState('');
    const [markdownContent, setMarkdownContent] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    const [isPreview, setIsPreview] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const navigate = useNavigate();
    const { token, handleUnauthorized, user } = useAuth();

    const handleImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setImageFile(event.target.files[0]);
        }
    };

    const handleSubmit = useCallback(async (event) => {
        event.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        if (!token) {
            setError("You must be logged in to create a post.");
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('snippet', snippet);
        formData.append('content', markdownContent);
        formData.append('date', date);
        formData.append('author', user?.username || 'Unknown Author');

        if (imageFile) {
            formData.append('image_file', imageFile);
        }

        const createUrl = '/api/posts/';

        try {
            const headers = {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            };

            const response = await fetch(createUrl, {
                method: 'POST',
                headers: headers,
                body: formData,
            });

            if (response.status === 401 || response.status === 403) {
                handleUnauthorized();
                throw new Error("Authorization failed.");
            }

            if (!response.ok) {
                let errorMsg = `Failed to create post: ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorMsg = errorData.detail || errorData.message || errorMsg;
                } catch (e) { /* Ignore */ }
                throw new Error(errorMsg);
            }

            const createdPost = await response.json();
            setSuccess(`Post "${createdPost.title}" created successfully!`);
            // Optionally clear form or navigate
            // navigate(`/post/${createdPost.id}`);
            navigate('/'); // Navigate home after successful creation

        } catch (err) {
            console.error("Create post API call failed:", err);
            if (err.message !== "Authorization failed.") {
                setError(err.message || 'Failed to create post. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    }, [title, snippet, markdownContent, imageFile, date, user, token, navigate, handleUnauthorized]);

    return (
        <Container component="main" maxWidth="md">
            <Paper elevation={3} sx={{ marginTop: 4, padding: { xs: 2, md: 4 } }}>
                <Typography component="h1" variant="h4" align="center" gutterBottom>
                    Create New Post
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <TextField
                        margin="normal" required fullWidth id="title" label="Post Title" name="title"
                        value={title} onChange={(e) => setTitle(e.target.value)} disabled={loading} autoFocus
                    />
                    <TextField
                        margin="normal" required fullWidth id="snippet" label="Snippet (Short Description)" name="snippet"
                        value={snippet} onChange={(e) => setSnippet(e.target.value)} disabled={loading}
                    />
                    <TextField
                        margin="normal" required fullWidth id="date" label="Publication Date" name="date" type="date"
                        value={date} onChange={(e) => setDate(e.target.value)} InputLabelProps={{ shrink: true }} disabled={loading}
                    />
                    <FormControlLabel
                        control={
                            <Input
                                type="file" id="imageUpload" name="imageUpload" onChange={handleImageChange}
                                disabled={loading} sx={{ display: 'block', mt: 2 }} inputProps={{ accept: 'image/*' }}
                            /> }
                        label="Upload Header Image (Optional)" labelPlacement="top" sx={{ alignItems: 'flex-start', mb: 1, width: '100%' }}
                    />
                    {imageFile && <Typography variant="caption">Selected: {imageFile.name}</Typography>}

                    <FormControlLabel
                        control={<Switch checked={isPreview} onChange={() => setIsPreview(!isPreview)} disabled={loading}/>}
                        label="Show Preview" sx={{ my: 2 }}
                    />

                    {isPreview ? (
                        <Paper variant="outlined" sx={{ p: 2, mt: 1, mb: 2, minHeight: '300px', overflowWrap: 'break-word', bgcolor: 'grey.100' }}>
                            {markdownContent ? (
                                <ReactMarkdown>{markdownContent}</ReactMarkdown>
                            ) : (
                                <Typography color="textSecondary">Start writing to see preview...</Typography>
                            )}
                        </Paper>
                    ) : (
                        <TextField
                            margin="normal" required fullWidth id="markdownContent" label="Post Content (Markdown)" name="markdownContent"
                            multiline rows={15} value={markdownContent} onChange={(e) => setMarkdownContent(e.target.value)} disabled={loading}
                        />
                    )}

                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={loading}>
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Save Post'}
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
}

export default CreatePostPage;