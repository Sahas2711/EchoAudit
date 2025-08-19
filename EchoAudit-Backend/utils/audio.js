const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
ffmpeg.setFfmpegPath(ffmpegPath);
const { v4: uuidv4 } = require('uuid');

/**
 * Converts any common audio (mp3/wav/m4a etc) to 16kHz mono WAV required by Vosk.
 * Returns the new WAV path.
 */
function ensureWav16kMono(inputPath) {
  return new Promise((resolve, reject) => {
    const outDir = path.join(path.dirname(inputPath));
    const outPath = path.join(outDir, `${uuidv4()}.wav`);

    ffmpeg(inputPath)
      .audioChannels(1)
      .audioFrequency(16000)
      .format('wav')
      .on('error', (err) => reject(err))
      .on('end', () => resolve(outPath))
      .save(outPath);
  });
}

function safeUnlink(p) {
  if (!p) return;
  fs.unlink(p, () => {});
}

module.exports = { ensureWav16kMono, safeUnlink };
