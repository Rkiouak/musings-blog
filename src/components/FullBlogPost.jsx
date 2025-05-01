import { Box, Typography, Divider, Paper } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import DOMPurify from 'dompurify';

function containsHtmlTags(content) {
    if (!content || typeof content !== 'string') {
        return false;
    }
    const htmlTagRegex = /<[a-z/][\s\S]*>/i;
    return htmlTagRegex.test(content);
}

function FullBlogPost({ post }) {
    if (!post) {
        return <Typography>Post not found.</Typography>;
    }

    // Determine if content likely contains HTML *before* hooks
    const isHtmlContent = containsHtmlTags(post.content);


    return (
        <Paper elevation={2} sx={{ p: { xs: 2, md: 4 } }}>
            <Typography variant="h4" component="h1" gutterBottom>
                {post.title}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                By {post.author} on {post.date}
            </Typography>
            {post.imageUrl && (
                <Box
                    component="img"
                    src={post.imageUrl}
                    alt={post.title}
                    sx={{
                        maxHeight: '200px',
                        objectFit: 'scale-down',
                        mb: 3,
                    }}
                />
            )}
            <Divider sx={{ my: 3 }} />

            {isHtmlContent ? (
                <Box dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }} />
            ) : (
                <Box component="div" sx={{
                    '& h1': { mb: 2 },
                    '& h2': { mb: 2 },
                    '& h3': { mb: 1.5 },
                    '& p': { mb: 1.5 },
                    '& ul, & ol': { pl: 3, mb: 1.5 },
                    '& blockquote': { borderLeft: '4px solid grey', pl: 2, ml: 0, fontStyle: 'italic' },
                    overflow: "scroll"
                }}>
                    <ReactMarkdown>{post.content || ''}</ReactMarkdown>
                </Box>
            )}
            {/* --- End Conditional Content Rendering --- */}

        </Paper>
    );
}

export default FullBlogPost;