import  { useState, useEffect } from 'react';
import { TextField, Button, Typography } from '@mui/material';
import axios from 'axios';

const Comments = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    const response = await axios.get(`http://localhost:5000/api/comments/${postId}`);
    setComments(response.data);
  };

  const handleAddComment = async () => {
    await axios.post('http://localhost:5000/api/comments', { postId, user_id: 1, comment: newComment });
    setNewComment('');
    fetchComments();
  };

  return (
    <div>
      <Typography variant="h6">Comments</Typography>
      {comments.map((c) => (
        <Typography key={c.id}>{c.username}: {c.comment}</Typography>
      ))}
      <TextField
        fullWidth
        placeholder="Add a comment..."
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
      />
      <Button onClick={handleAddComment}>Comment</Button>
    </div>
  );
};

export default Comments;
