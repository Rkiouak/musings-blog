// src/components/BlogPostPreview.jsx
import React from 'react';
import { Card, CardContent, CardMedia, Typography, CardActions, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';


// Expects a 'post' object prop with id, title, snippet, imageUrl, date, author
function BlogPostPreview({ post }) {
    const theme = useTheme(); // Get the theme object

    if (!post) return null; // Handle case where post data might be missing

  return (
    <Card sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        transition: theme.transitions.create(['box-shadow', 'transform'], { duration: theme.transitions.duration.short }), // Add transition
        '&:hover': {
            transform: 'translateY(-4px)', // Example: slight lift
            boxShadow: theme.shadows[4], // Example: increase shadow
        }
    }}>
       {post.imageUrl && (
         <CardMedia
           component="img"
           height="140"
           image={post.imageUrl}
           alt={post.title}
         />
       )}
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="div">
          {post.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          By {post.author} on {post.date}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {post.snippet}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" component={RouterLink} to={`/post/${post.id}`}>
          Read More
        </Button>
      </CardActions>
    </Card>
  );
}

export default BlogPostPreview;
