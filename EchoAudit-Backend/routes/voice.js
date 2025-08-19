const express = require('express');
const multer = require('multer');
const path = require('path');
const { processVoice } = require('../controllers/voiceController');

const router = express.Router();

// Store uploads in /uploads
const upload = multer({
  dest: path.join(__dirname, '..', 'uploads'),
  limits: { fileSize: 30 * 1024 * 1024 } // 30MB
});

router.post('/', upload.single('audio'), processVoice);

module.exports = router;
