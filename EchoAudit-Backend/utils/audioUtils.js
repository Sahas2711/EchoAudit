const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
ffmpeg.setFfmpegPath(ffmpegPath);
const { v4: uuidv4 } = require('uuid');

/**
 * Converts any audio to 16kHz mono WAV for Azure
 */
function ensureWav16kMono(inputPath) {
  return new Promise((resolve, reject) => {
    const outDir = path.join(path.dirname(inputPath));
    const outPath = path.join(outDir, `${uuidv4()}.wav`);

    ffmpeg(inputPath)
      .audioChannels(1)
      .audioFrequency(16000)
      .format('wav')
      .on('error', reject)
      .on('end', () => resolve(outPath))
      .save(outPath);
  });
}

/**
 * Deletes a file safely without crashing the app
 */
function safeUnlink(p) {
  if (!p) return;
  fs.unlink(p, () => {});
}

module.exports = { ensureWav16kMono, safeUnlink };
