const fs = require('fs');
const wav = require('wav');
const vosk = require('vosk');

// Quiet logs
vosk.setLogLevel(0);

/**
 * Prepare/load Vosk model (once).
 * Download a model (e.g., "vosk-model-small-en-us-0.15") and place it under ./model
 */
const MODEL_PATH = 'model';
if (!fs.existsSync(MODEL_PATH)) {
  console.error("Vosk model not found. Download a model and place it in ./model\n" +
    "Example: vosk-model-small-en-us-0.15 from https://alphacephei.com/vosk/models");
  process.exit(1);
}

let model;
function getModel() {
  if (!model) model = new vosk.Model(MODEL_PATH);
  return model;
}

/**
 * Transcribe a 16kHz mono WAV file using Vosk
 * @param {string} wavPath
 * @returns {Promise<string>} transcript
 */
function transcribeWav16kMono(wavPath) {
  return new Promise((resolve, reject) => {
    const wfReader = new wav.Reader();
    const stream = fs.createReadStream(wavPath);

    wfReader.on('format', (format) => {
      if (format.sampleRate !== 16000 || format.channels !== 1) {
        reject(new Error('WAV must be 16kHz mono. Use ensureWav16kMono first.'));
        return;
      }

      const rec = new vosk.Recognizer({ model: getModel(), sampleRate: format.sampleRate });

      wfReader.on('data', (data) => rec.acceptWaveform(data));
      wfReader.on('end', () => {
        const result = rec.finalResult(); // { text: "...", result: [...] }
        rec.free();
        resolve(result.text || '');
      });
    });

    wfReader.on('error', reject);
    stream.on('error', reject);
    stream.pipe(wfReader);
  });
}

module.exports = { transcribeWav16kMono };
