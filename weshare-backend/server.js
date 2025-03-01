const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  }
});

const upload = multer({ storage: storage });

// Route for uploading files
app.post('/upload', upload.array('files'), async (req, res) => {
  try {
    const files = req.files;
    const uploadId = Date.now();
    const shareLink = `${process.env.FRONTEND_URL}/download/${uploadId}`;

    // Save file paths with uploadId
    const filePaths = files.map(file => ({
      name: file.originalname,
      path: file.path
    }));

    fs.writeFileSync(`uploads/${uploadId}.json`, JSON.stringify(filePaths));

    res.status(200).json({ id: uploadId, link: shareLink });
  } catch (error) {
    console.error('Upload failed:', error);
    res.status(500).json({ message: 'Upload failed' });
  }
});

// Route for sending emails
app.post('/send-email', async (req, res) => {
  const { email, link } = req.body;

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  let mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your Shared File Link',
    text: `Here is the link to download your shared files: ${link}`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Failed to send email:', error);
    res.status(500).json({ message: 'Failed to send email' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});