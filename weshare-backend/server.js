const express = require('express');
const multer = require('multer');
const uploadRoutes = require('./routes/upload');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use('/api', uploadRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});