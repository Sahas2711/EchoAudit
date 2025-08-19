const fs = require("fs");
const path = require("path");
const axios = require("axios");
const FormData = require("form-data");
const { ensureWav16kMono, safeUnlink } = require("../utils/audioUtils");
const { analyzeText } = require("../utils/analyzeText");

async function processVoice(req, res) {
  if (!req.file) {
    return res.status(400).json({ error: "No audio file uploaded" });
  }

  const inputPath = req.file.path;
  let wavPath;

  try {
    // Convert uploaded file to 16kHz mono WAV
    wavPath = await ensureWav16kMono(inputPath);

    // Transcribe using ElevenLabs
    const transcription = await transcribeAudioWithElevenLabs(wavPath);

    // Analyze transcription text
    const patients = analyzeText(transcription);

    res.json({ transcription, patients });
  } catch (err) {
    console.error("Voice processing error:", err.response?.data || err.message);
    res.status(500).json({ error: "Voice processing failed" });
  } finally {
    // Always clean up files
    safeUnlink(inputPath);
    safeUnlink(wavPath);
  }
}

async function transcribeAudioWithElevenLabs(filePath) {
  if (!process.env.ELEVENLABS_API_KEY) {
    throw new Error("Missing ELEVENLABS_API_KEY");
  }

  const formData = new FormData();
  formData.append("file", fs.createReadStream(filePath));
  formData.append("model_id", "scribe_v1"); 
  formData.append("language_code", "en");

  const response = await axios.post(
    "https://api.elevenlabs.io/v1/speech-to-text",
    formData,
    { headers: { "xi-api-key": process.env.ELEVENLABS_API_KEY, ...formData.getHeaders() } }
  );

  return response.data.text || response.data.transcription || "";
}

module.exports = { processVoice };
