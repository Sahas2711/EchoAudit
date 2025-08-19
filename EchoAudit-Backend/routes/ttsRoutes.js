const express = require('express');
const { textToSpeech } = require('../controllers/ttsController');

const router = express.Router();

router.post('/', textToSpeech);

module.exports = router;
