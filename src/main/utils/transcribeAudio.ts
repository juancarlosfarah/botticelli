import { Audio } from '../entity/Audio';

const express = require('express');
const multer = require('multer');
const fs = require('fs');
const whisper = require('whisper-node');
const path = require('path');
const app = express();
const ffmpeg = require('fluent-ffmpeg');

const cors = require('cors');
app.use(cors());
// const upload = multer({ dest: 'uploads/' }); // Files will be saved in the "uploads" directory

/**
 * Resamples inputFilePath at newSampleRate (we want 16kHz for whisper-node)
 * and stores it at outputFilePath
 * @param {*} inputFilePath
 * @param {*} outputFilePath
 * @param {*} newSampleRate
 * @returns
 */
function resampleAudio(inputFilePath, outputFilePath, newSampleRate) {
  return new Promise((resolve, reject) => {
    ffmpeg(inputFilePath)
      .audioFrequency(newSampleRate)
      .output(outputFilePath)
      .on('end', () => resolve(outputFilePath))
      .on('error', (err) => reject(err))
      .run();
  });
}

export const transcribeAudio = async (audios: Audio[]): Promise<String> => {
  let speechText = '';

  audios.forEach(async (audio) => {
    const extension = '.wav'; // We want .wav files for whisper-node
    const originalFilePath = audio.blob;
    const filePathWithExtension = originalFilePath + extension;
    const resampledFilePath = originalFilePath + '_resampled' + extension;
    fs.renameSync(originalFilePath, filePathWithExtension);

    try {
      // Set the sample rate to 16kHz
      await resampleAudio(filePathWithExtension, resampledFilePath, 16000);

      // Transcribe the audio
      const transcript = await whisper.whisper(resampledFilePath, {
        modelName: 'base.en', // Specify model options as needed
      });

      // Process the transcription as needed
      const newText = transcript
        .map((t) => t.speech)
        .join(' ')
        .replace(/\[.*?\]/g, '');
      // res.json({ transcription: speechText });
      speechText += newText;
    } catch (error) {
      console.error(error);
    } finally {
      // Cleanup: delete the original and resampled files after transcription
      [filePathWithExtension, resampledFilePath].forEach((file) => {
        fs.unlink(file, (err) => {
          if (err) console.error('Failed to delete the file:', file, err);
        });
      });
    }
  });

  return speechText;
};
