const express = require("express");
const cloudinary = require("../middlewares/cloudinary"); // Import Cloudinary config
const router = express.Router();
const db = require("../config/db");
const multer = require("multer");
const path = require("path");

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Upload directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`); // Unique filename
  },
});

const upload = multer({ storage });

// Create a new post with image upload
router.post("/create", upload.single("image"), async (req, res) => {
  const { userId, content } = req.body;

  try {
    let imageUrl = null;

    if (req.file) {
      // Upload the image to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "posts", // Optional folder name in Cloudinary
      });
      imageUrl = result.secure_url; // Get the secure Cloudinary URL
    }

    const query =
      "INSERT INTO posts (user_id, content, image_url) VALUES (?, ?, ?)";
    db.query(query, [userId, content, imageUrl], (err, result) => {
      if (err) return res.status(500).json(err);
      res.status(200).json({
        message: "Post created successfully!",
        postId: result.insertId,
      });
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Image upload failed", details: err.message });
  }
});

// Get all posts with likes, comments count, and actual comments
router.get("/", (req, res) => {
  let sortColumn = "posts.created_at"; // Default sort column
  let sortOrder = "DESC"; // Default sort order (most recent first)

  if (req.query.sortBy === "likes") {
    sortColumn = "(SELECT COUNT(*) FROM likes WHERE likes.post_id = posts.id)";
    sortOrder = "DESC"; // Sort by like count in descending order
  }

  const query = `
  SELECT 
    posts.id, 
    posts.user_id, 
    users.username, 
    posts.content, 
    posts.image_url, 
    posts.created_at,
    (SELECT COUNT(*) FROM likes WHERE likes.post_id = posts.id) AS like_count,
    JSON_ARRAYAGG(
      JSON_OBJECT(
        'comment_id', comments.id, 
        'content', comments.comment, 
        'created_at', comments.created_at
      )
    ) AS comments
  FROM posts 
  JOIN users ON posts.user_id = users.id 
  LEFT JOIN comments ON comments.post_id = posts.id
  GROUP BY posts.id 
  ORDER BY ${sortColumn} ${sortOrder}
`;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(results);
  });
});

// Like or unlike a post
router.post("/like", (req, res) => {
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
});

// Add a comment to a post
router.post("/comment", (req, res) => {
  const { postId, userId, comment } = req.body;
  const query =
    "INSERT INTO comments (post_id, user_id, comment) VALUES (?, ?, ?)";
  db.query(query, [postId, userId, comment], (err, result) => {
    if (err) return res.status(500).json(err);
    res.status(200).json({ message: "Comment added successfully!" });
  });
});

module.exports = router;
