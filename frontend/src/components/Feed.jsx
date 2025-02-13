import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  IconButton,
  Select,
  MenuItem,
  Avatar,
  Box,
} from "@mui/material";
import {
  ThumbUp,
  Comment,
  Image as ImageIcon,
  Logout,
} from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [sortOption, setSortOption] = useState("recent");
  const [newComment, setNewComment] = useState("");
  // const [likedPosts, setLikedPosts] = useState(new Set());
  const [hasLiked, setHasLiked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, [sortOption]);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/posts?sortBy=${sortOption}`
      );
      console.log(response.data, "Response Data");
      
      // No need to parse comments; they are already a JSON array
      const postsWithComments = response.data.map((post) => ({
        ...post,
        comments: post.comments || [],  // Ensure comments is an array
      }));
      
      setPosts(postsWithComments);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };
  

  const handleNewPost = async () => {
    const formData = new FormData();
    formData.append("userId", 1); // Use actual userId from localStorage or context
    formData.append("content", newPost);
    if (selectedImage) formData.append("image", selectedImage);

    try {
      await axios.post("http://localhost:5000/api/posts/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setNewPost("");
      setSelectedImage(null);
      fetchPosts();
    } catch (error) {
      console.error(error);
    }
  };

  const handleLike = async (postId) => {
    try {
      await axios.post("http://localhost:5000/api/posts/like", {
        postId,
        userId: 1,
      });
      // Toggle like state

      setHasLiked(!hasLiked);
      fetchPosts();
    } catch (error) {
      console.error(error);
    }
  };

  const handleNewComment = async (postId) => {
    try {
      await axios.post("http://localhost:5000/api/posts/comment", {
        postId,
        userId: 1,
        comment: newComment,
      });
      setNewComment("");
      fetchPosts();
    } catch (error) {
      console.error(error);
    }
  };

  function handleLogout() {
    const isConfirmed = window.confirm("Are you sure you want to log out?");

    if (isConfirmed) {
      localStorage.removeItem("token");
      alert("You have successfully logged out.");
      navigate("/");
    }
  }
  console.log(posts);
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Create Post Section */}
      <Card className="mb-6 shadow-lg rounded-lg">
        <CardContent>
          <div className="flex place-content-between cursor-pointer">
            <Typography variant="h6" className="font-bold mb-4 text-gray-800">
              Create a Post
            </Typography>
            <Logout onClick={handleLogout} />
          </div>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="What's on your mind?"
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            multiline
            rows={3}
            className="mb-4 bg-white rounded-lg"
          />
          <div className="mb-4 mt-4">
            <Button
              variant="outlined"
              component="label"
              startIcon={<ImageIcon />}
              className="mr-2 border-blue-500 text-blue-500 hover:bg-blue-50"
            >
              Upload Image
              <input
                type="file"
                hidden
                onChange={(e) => setSelectedImage(e.target.files[0])}
              />
            </Button>
            {selectedImage && (
              <Box className="mt-2">
                <img
                  src={URL.createObjectURL(selectedImage)}
                  alt="Preview"
                  className="w-48 h-48 object-cover rounded-lg shadow-sm"
                />
                <Typography className="mt-2 text-sm text-gray-600">
                  {selectedImage.name}
                </Typography>
              </Box>
            )}
          </div>
          <Button
            variant="contained"
            onClick={handleNewPost}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md"
          >
            Post
          </Button>
        </CardContent>
      </Card>

      {/* Sort Posts Section */}
      <Card className="mb-6 shadow-lg rounded-lg">
        <CardContent>
          <Typography variant="h6" className="font-bold mb-2 text-gray-800">
            Sort Posts
          </Typography>
          <Select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="bg-white rounded-lg"
            fullWidth
          >
            <MenuItem value="recent">Most Recent</MenuItem>
            <MenuItem value="likes">Most Liked</MenuItem>
            <MenuItem value="comments">Most Commented</MenuItem>
          </Select>
        </CardContent>
      </Card>

      {/* Posts Section */}
      {posts.map((post) => (
        <Card
          key={post.id}
          className="mb-6 shadow-lg rounded-lg hover:shadow-xl transition-shadow"
        >
          <CardContent>
            <Box className="flex items-center mb-4">
              <Avatar className="mr-2 bg-blue-500">
                {post.username.charAt(0)}
              </Avatar>
              <Typography variant="h6" className="font-bold text-gray-800">
                {post.username}
              </Typography>
            </Box>
            <Typography variant="body1" className="mb-4 text-gray-700">
              {post.content}
            </Typography>
            {post.image_url && (
              <img
                src={post.image_url}
                alt="Post"
                className="w-full rounded-lg mb-4 shadow-sm"
              />
            )}
            <Box className="flex items-center justify-between mb-4">
              <IconButton
                onClick={() => handleLike(post.id)}
                color={hasLiked ? "primary" : "default"}
                className={`transition-colors ${
                  hasLiked ? "text-blue-500" : "text-gray-500"
                }`}
              >
                <ThumbUp />
              </IconButton>
              <Typography className="text-gray-700">
                {post.like_count} Likes
              </Typography>
              <IconButton className="text-gray-500 hover:text-blue-500">
                <Comment />
              </IconButton>
              <Typography className="text-gray-700">
                {post.comments.length} Comments
              </Typography>
            </Box>

            {/* Comment Section */}

            <Box className="mb-4">
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="bg-white rounded-lg"
              />
              <div className="mt-4">
                <Button
                  variant="contained"
                  onClick={() => handleNewComment(post.id)}
                  className="mt-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md"
                >
                  Comment
                </Button>
              </div>
            </Box>

            {/* Display Comments */}
            {post.comments &&
              post.comments.map((comment, index) => (
                <Box key={index} className="mt-2 bg-gray-100 p-3 rounded-lg">
                  <Typography variant="body2" className="text-gray-800">
                    <strong>{comment.content}</strong> 
                  </Typography>
                </Box>
              ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Feed;
