const fs = require("fs");
const path = require("path");
const axios = require("axios");
const FormData = require("form-data");
const { ensureWav16kMono, safeUnlink } = require("../utils/audioUtils");
const { analyzeText,playVoice } = require("../utils/analyzer");
const log = require('../models/logModel');
const player = require("play-sound")({ player: "vlc" });   // or "afplay", "mplayer", "ffplay"

async function processVoice(req, res) {
  if (!req.file) {
    return res.status(400).json({ error: "No audio file uploaded" });
  }
  // console.log('processVoice initiated');
  const inputPath = req.file.path;
  let wavPath;

  try {
    // Convert to WAV if needed
    wavPath = await ensureWav16kMono(inputPath);
    
    // console.log("Attempting to play:", wavPath);
    // fs.existsSync(wavPath) ? console.log("✅ File exists") : console.log("❌ File missing");

    // await playVoiceFile(wavPath);
    // Transcribe
    const transcription = await transcribeAudioWithElevenLabs(wavPath);

    // Analyze
    const analysis = await analyzeText(transcription);

    // 👉 Insert into DB for each patient found
    // console.log(analysis);
    if (analysis.length > 0) {
      analysis.forEach(patient => {
        log.create(
          patient.bed,
          patient.issue,
          patient.recommended_action,
          transcription,
          (err, result) => {
            if (err) {
              console.error("❌ DB insert error:", err);
            } else {
              console.log(`✅ Log saved for bed ${patient.bed}, ID: ${result.insertId}`);
               playVoice("Data saved successfully");
            }
          }
        );
      });
    } else {
      console.warn("⚠ No patient info extracted, skipping DB insert.");
    }

    // Respond to client
    res.json({
      transcription,
      patients: analysis
    });

  } catch (err) {
    console.error("Voice processing error:", err.response?.data || err.message);
    res.status(500).json({ error: "Voice processing failed" });
  } finally {
    safeUnlink(inputPath);
    safeUnlink(wavPath);
  }
}

async function transcribeAudioWithElevenLabs(filePath) {
  if (!process.env.ELEVENLABS_API_KEY) {
    console.warn("⚠ No ElevenLabs API Key — using mock transcription");
    return "Patient in bed 12 has fever. Recommended action give paracetamol.";
  }

  const formData = new FormData();
  formData.append("file", fs.createReadStream(filePath));
  formData.append("model_id", "scribe_v1_experimental");
  //formData.append("language_code", "");

  const response = await axios.post(
    "https://api.elevenlabs.io/v1/speech-to-text",
    formData,
    {
      headers: {
        "xi-api-key": process.env.ELEVENLABS_API_KEY,
        ...formData.getHeaders()
      }
    }
  );

  return response.data.text;
}

function playVoiceFile(filePath) {
  return new Promise((resolve, reject) => {
    player.play(filePath, (err) => {
      if (err) {
        console.error("❌ Error playing file:", err);
        return reject(err);
      }
      console.log("🎵 Finished playing:", filePath);
      resolve();
    });
  });
}


module.exports = { processVoice };
