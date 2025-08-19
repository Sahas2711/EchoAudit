const fs = require('fs');
const path = require('path');
const axios = require('axios');

async function textToSpeech(req, res) {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: "Text is required" });
  }

  try {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Missing ElevenLabs API key" });
    }

    const voiceId = "JBFqnCBsd6RMkjVDRZzb"; // Example voice, can be changed
    const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`;

    const response = await axios.post(url, {
      text,
      model_id: "eleven_multilingual_v2"
    }, {
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json"
      },
      responseType: 'arraybuffer'
    });

    const outputPath = path.join(__dirname, '..', 'uploads', `tts_${Date.now()}.mp3`);
    fs.writeFileSync(outputPath, response.data);

    res.download(outputPath, err => {
      if (err) {
        console.error("Download error:", err);
      }
      fs.unlink(outputPath, () => {}); // Remove file after sending
    });
  } catch (err) {
    console.error("TTS error:", err.response?.data || err.message);
    res.status(500).json({ error: "Text-to-speech failed" });
  }
}

module.exports = { textToSpeech };
