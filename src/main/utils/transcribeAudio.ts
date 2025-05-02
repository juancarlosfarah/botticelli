import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path';
import whisper from 'whisper-node';

import { Audio } from '../entity/Audio';

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

export const transcribeAudio = async (blobPath: string): Promise<String> => {
  let speechText = '';

  const extension = '.wav'; // We want .wav files for whisper-node
  const originalFilePath = blobPath;
  const fileNameWithoutExt = path.basename(
    originalFilePath,
    path.extname(originalFilePath),
  );

  const filePathWithExtension = originalFilePath + extension;
  const resampledFilePath = path.join(
    path.dirname(originalFilePath),
    `${fileNameWithoutExt}_resampled${extension}`,
  );

  // const resampledFilePath = originalFilePath  + '_resampled' + extension;
  fs.renameSync(originalFilePath, filePathWithExtension);

  try {
    // Set the sample rate to 16kHz
    await resampleAudio(filePathWithExtension, resampledFilePath, 16000);

    // Transcribe the audio
    const transcript = await whisper.whisper(resampledFilePath, {
      modelName: 'base',
      whisperOptions: {
        language: 'auto', // default (use 'auto' for auto detect)
        gen_file_txt: false, // outputs .txt file
        gen_file_subtitle: false, // outputs .srt file
        gen_file_vtt: false, // outputs .vtt file
        word_timestamps: true,
      },
    });

    // Process the transcription as needed
    const newText = transcript
      .map((t) => t.speech)
      .join(' ')
      .replace(/\[.*?\]/g, '');
    speechText += newText;
  } catch (error) {
    console.error(error);
  } finally {
    // Cleanup: delete the original files after transcription
    [filePathWithExtension].forEach((file) => {
      fs.unlink(file, (err) => {
        if (err) console.error('Failed to delete the file:', file, err);
      });
    });
  }

  return speechText;
};
