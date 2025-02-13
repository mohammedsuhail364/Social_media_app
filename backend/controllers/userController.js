const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const connection = require("../config/db"); // Assume `pool` is your MySQL connection pool

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// @desc Register a new user
// @route POST /api/users/register
 // Ensure this is using mysql2/promise

 const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400).json({ message: 'All fields are required' });
    return;
  }

  // Check if user already exists in the database
  connection.execute('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) {
      res.status(500).json({ message: 'Database error' });
      return;
    }

    if (results.length > 0) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user into the database
    connection.execute(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword],
      (err) => {
        if (err) {
          res.status(500).json({ message: 'Database error while inserting user' });
          return;
        }

        res.status(201).json({ message: 'User registered successfully' });
      }
    );
  });
});
// @desc Login user and get token
// @route POST /api/users/login
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide both email and password");
  }

  // Check for user in the database
  connection.query("SELECT * FROM users WHERE email = ?", [email], async (err, rows) => {
    if (err) {
      res.status(500);
      throw new Error("Database query failed");
    }

    if (rows.length > 0) {
      const user = rows[0];

      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        res.json({
          id: user.id,
          name: user.name,
          email: user.email,
          // Generate and return token
        });
      } else {
        res.status(401);
        throw new Error("Invalid email or password");
      }
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  });
});
// @desc Get user profile
// @route GET /api/users/profile
const getUserProfile = asyncHandler(async (req, res) => {
  const [rows] = await pool.execute(
    "SELECT id, name, email FROM users WHERE id = ?",
    [req.user.id]
  );

  if (rows.length > 0) {
    res.json(rows[0]);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc Logout user
// @route POST /api/users/logout
const logoutUser = (req, res) => {
  res.status(200).json({ message: "User logged out successfully" });
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  logoutUser,
};
