const db = require("../config/db");

// Create a new post
const createPost = (req, res) => {
  const { userId, content } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  const query = "INSERT INTO posts (user_id, content, image_url) VALUES (?, ?, ?)";
  db.query(query, [userId, content, imageUrl], (err, result) => {
    if (err) return res.status(500).json(err);
    res.status(200).json({ message: "Post created successfully!", postId: result.insertId });
  });
};

// Get all posts with likes and comments
const getAllPosts = (req, res) => {
  const query = `
    SELECT posts.id, posts.user_id, users.username, posts.content, posts.image_url, posts.created_at,
    (SELECT COUNT(*) FROM likes WHERE likes.post_id = posts.id) AS like_count,
    (SELECT COUNT(*) FROM comments WHERE comments.post_id = posts.id) AS comment_count
    FROM posts 
    JOIN users ON posts.user_id = users.id 
    ORDER BY posts.created_at DESC
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json(err);

    const postsWithComments = [];
    let processedCount = 0;

    results.forEach((post) => {
      const commentQuery = `
        SELECT comments.id, comments.comment, comments.created_at, users.username
        FROM comments
        JOIN users ON comments.user_id = users.id
        WHERE comments.post_id = ?
        ORDER BY comments.created_at DESC
      `;
      db.query(commentQuery, [post.id], (err, comments) => {
        if (err) return res.status(500).json(err);
        
        post.comments = comments;
        postsWithComments.push(post);
        processedCount++;

        if (processedCount === results.length) {
          res.status(200).json(postsWithComments);
        }
      });
    });

    if (results.length === 0) res.status(200).json([]);
  });
};

// Like or unlike a post
const likePost = (req, res) => {
  const { postId, userId } = req.body;
  const checkQuery = "SELECT * FROM likes WHERE post_id = ? AND user_id = ?";
  db.query(checkQuery, [postId, userId], (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length > 0) {
      const deleteQuery = "DELETE FROM likes WHERE post_id = ? AND user_id = ?";
      db.query(deleteQuery, [postId, userId], (err) => {
        if (err) return res.status(500).json(err);
        res.status(200).json({ message: "Unliked successfully!" });
      });
    } else {
      const insertQuery = "INSERT INTO likes (post_id, user_id) VALUES (?, ?)";
      db.query(insertQuery, [postId, userId], (err) => {
        if (err) return res.status(500).json(err);
        res.status(200).json({ message: "Liked successfully!" });
      });
    }
  });
};

// Add a comment to a post
const addComment = (req, res) => {
  const { postId, userId, comment } = req.body;
  const query = "INSERT INTO comments (post_id, user_id, comment) VALUES (?, ?, ?)";
  db.query(query, [postId, userId, comment], (err, result) => {
    if (err) return res.status(500).json(err);
    res.status(200).json({ message: "Comment added successfully!" });
  });
};

module.exports = {
  createPost,
  getAllPosts,
  likePost,
  addComment
};
