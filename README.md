Social Media Feed

A social media feed application built with React, Material-UI (MUI), Node.js, Express.js, and MySQL. This application allows users to register, log in, create posts, like/unlike posts, and comment on posts. It also includes features like sorting posts by popularity and displaying a user's own posts separately.

Features
User Authentication:

Registration and login functionality.

Secure password storage using bcrypt.

Post Management:

Create, view, like/unlike, and comment on posts.

Upload images with posts.

Display posts in a feed format with user details, content, likes, and comments.

Feed Features:

Sort posts by popularity (based on likes and comments).

Display a user's own posts separately.

Responsive UI:

Built using Material-UI (MUI) for a clean and responsive design.

Technology Stack
Frontend: React with Material-UI (MUI) for styling and UI components.

Backend: Node.js and Express.js for API development.

Database: MySQL for persistent data storage.

Authentication: JWT (JSON Web Tokens) for secure user authentication.

Installation
Prerequisites
Node.js and npm installed on your machine.

MySQL server installed and running.

Steps
Clone the repository:

bash
Copy
git clone https://github.com/your-username/social-media-feed.git
cd social-media-feed
Install dependencies:

For the backend:

bash
Copy
cd backend
npm install
For the frontend:

bash
Copy
cd ../frontend
npm install
Set up the database:

Create a MySQL database named social_media_feed.

Update the database configuration in backend/config/db.js with your MySQL credentials.

Run database migrations:

Navigate to the backend folder and run:

bash
Copy
npx sequelize-cli db:migrate
Start the backend server:

In the backend folder, run:

bash
Copy
npm start
The server will start on http://localhost:5000.

Start the frontend application:

In the frontend folder, run:

bash
Copy
npm start
The application will open in your browser at http://localhost:3000.

Usage
Register a new user:

Navigate to the registration page and fill in the required details.

After registration, log in with your credentials.

Create a post:

Click on the "Create Post" button.

Add post content and upload an image (optional).

Submit the post to add it to the feed.

Interact with posts:

Like/unlike posts by clicking the "Like" button.

Add comments to posts using the comment form.

Sort posts:

Use the sorting options to view posts by popularity (likes/comments).

View your posts:

Navigate to the "My Posts" section to view posts created by you.

Folder Structure
Copy
social-media-feed/
├── backend/               # Backend code
│   ├── config/           # Database configuration
│   ├── controllers/      # API controllers
│   ├── middleware/       # Authentication middleware
│   ├── models/           # Sequelize models
│   ├── routes/           # API routes
│   └── server.js         # Entry point for the backend
├── frontend/             # Frontend code
│   ├── public/           # Static assets
│   ├── src/              # React components and logic
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── App.js        # Main application component
│   │   └── index.js      # Entry point for the frontend
│   └── package.json      # Frontend dependencies
├── .gitignore            # Files and folders to ignore in Git
├── README.md             # Project documentation
└── package.json          # Backend dependencies
API Endpoints
Authentication:

POST /api/auth/register - Register a new user.

POST /api/auth/login - Log in a user.

Posts:

GET /api/posts - Fetch all posts.

POST /api/posts - Create a new post.

PUT /api/posts/:id/like - Like/unlike a post.

POST /api/posts/:id/comment - Add a comment to a post.

Users:

GET /api/users/me/posts - Fetch posts created by the logged-in user.

Screenshots

![image](https://github.com/user-attachments/assets/ec781f3d-b6f5-4ba3-b894-b49655ccd814)

![image](https://github.com/user-attachments/assets/52a9f166-245d-4470-a9f9-8a04176eaeb3)

![image](https://github.com/user-attachments/assets/3bf86974-87b2-47a0-a4ed-b3d71a748801)


Contributing
Contributions are welcome! If you'd like to contribute, please follow these steps:

Fork the repository.

Create a new branch for your feature or bugfix.

Commit your changes and push to the branch.

Submit a pull request.

License
This project is licensed under the MIT License. See the LICENSE file for details.

Acknowledgments
Material-UI for the UI components.

Sequelize for database management.

React and Node.js communities for their amazing tools and libraries.
