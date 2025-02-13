const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const postRoutes = require('./routes/postRoutes');
const userRoutes = require('./routes/userRoutes');
const app = express();

app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  