import { execFile, execSync } from 'child_process';
import { app } from 'electron';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import { platform } from 'os';
import path from 'path';
import util from 'util';

import { getUserAudioPath } from './path';

const execFilePromise = util.promisify(execFile);

const isProd = app.isPackaged;
const ffmpegPath = isProd
  ? path.join(process.resourcesPath, 'ffmpeg')
  : require('ffmpeg-static');

try {
  const versionOutput = execSync(`${ffmpegPath} -version`).toString();
  console.log('[FFmpeg] ffmpeg -version:\n', versionOutput);
} catch (err) {
  console.error('[FFmpeg] ERROR running ffmpeg -version:', err);
}

console.log('[FFmpeg] Using ffmpeg path:', ffmpegPath);

ffmpeg.setFfmpegPath(ffmpegPath);

function getWhisperExecPath(): string {
  const isProd = app.isPackaged;

  if (isProd) {
    const base = process.resourcesPath;
    if (platform() === 'darwin')
      return path.join(base, 'whisper-bin', 'darwin', 'main');
    if (platform() === 'win32')
      return path.join(base, 'whisper-bin', 'win', 'main.exe');
    if (platform() === 'linux')
      return path.join(base, 'whisper-bin', 'linux', 'main');
  } else {
    if (platform() === 'darwin')
      return path.join(
        __dirname,
        '..',
        '..',
        'resources',
        'whisper-bin',
        'darwin',
        'main',
      );
    if (platform() === 'win32')
      return path.join(
        __dirname,
        '..',
        '..',
        'resources',
        'whisper-bin',
        'win',
        'main.exe',
      );
    if (platform() === 'linux')
      return path.join(
        __dirname,
        '..',
        '..',
        'resources',
        'whisper-bin',
        'linux',
        'main',
      );
  }

  throw new Error('Unsupported OS');
}

function resampleAudio(
  inputFilePath: string,
  outputFilePath: string,
): Promise<string> {
  console.log('[FFmpeg] Resampling:', inputFilePath, '→', outputFilePath);
  return new Promise((resolve, reject) => {
    ffmpeg(inputFilePath)
      .noVideo()
      .audioChannels(1)
      .audioCodec('pcm_s16le')
      .audioFrequency(16000)
      .outputOptions([
        '-f',
        'wav',
        '-ac',
        '1',
        '-ar',
        '16000',
        '-acodec',
        'pcm_s16le',
      ])
      .output(outputFilePath)
      .on('stderr', (line) => {
        console.warn('[FFmpeg STDERR]', line);
      })

      .on('start', (commandLine) => {
        console.log('[FFmpeg] Spawned command:', commandLine);
      })

      .on('end', () => {
        console.log('[FFmpeg] FFmpeg ended. Checking file:', outputFilePath);

        if (!fs.existsSync(outputFilePath)) {
          console.error(
            '[FFmpeg] Output file missing after end:',
            outputFilePath,
          );
          reject(new Error('Output file not found'));
          return;
        }

        const size = fs.statSync(outputFilePath).size;
        console.log('[FFmpeg] Output file size after end:', size);
        if (size < 1000) {
          console.error('[FFmpeg] Output file too small to be valid');
          reject(new Error('Output file too small'));
          return;
        }

        console.log('[FFmpeg] Resample complete. File is valid.');
        resolve(outputFilePath);
      })

      .on('error', (err) => {
        console.error('[FFmpeg ERROR]', err.message);
        reject(err);
      })

      .run();
  });
}

export const transcribeAudio = async ({
  blobPath,
  audioId,
}: {
  blobPath: string;
  audioId: string;
}): Promise<string> => {
  const savedAudiosDir = getUserAudioPath();
  const intermediatePath = path.join(savedAudiosDir, `${audioId}.input`);

  const resampledFilePath = path.join(
    savedAudiosDir,
    `${audioId}_resampled.wav`,
  );

  const transcriptTxtPath = `${resampledFilePath}.txt`;

  if (!fs.existsSync(blobPath)) {
    console.error('[transcribeAudio] blobPath does not exist:', blobPath);
    throw new Error('Invalid blobPath input');
  }

  if (!fs.existsSync(intermediatePath)) {
    console.log(
      '[transcribeAudio] Copying to intermediatePath:',
      intermediatePath,
    );
    fs.copyFileSync(blobPath, intermediatePath);
    console.log(
      '[transcribeAudio] Intermediate file size:',
      fs.statSync(intermediatePath).size,
    );
  }

  const modelPath = isProd
    ? path.join(process.resourcesPath, 'models', 'ggml-base.bin')
    : path.join(__dirname, '..', '..', 'resources', 'models', 'ggml-base.bin');
  const execPath = getWhisperExecPath();

  if (!fs.existsSync(execPath)) throw new Error('Whisper binary not found');
  if (!fs.existsSync(modelPath)) throw new Error('Model file not found');

  try {
    await resampleAudio(intermediatePath, resampledFilePath, 16000);

    console.log('[DEBUG] Checking resampled path:', resampledFilePath);
    console.log('[DEBUG] File exists:', fs.existsSync(resampledFilePath));

    if (!fs.existsSync(resampledFilePath)) {
      console.error('[DEBUG] Resampled file not found:', resampledFilePath);
      throw new Error('Resampled file missing');
    }

    const { stdout, stderr } = await execFilePromise(
      execPath,
      ['-m', modelPath, '-f', resampledFilePath, '-otxt', '-l', 'auto'],
      { cwd: savedAudiosDir },
    );
    console.log('[DEBUG] Whisper stdout:', stdout);
    console.log('[DEBUG] Whisper stderr:', stderr);

    let retries = 5;
    while (!fs.existsSync(transcriptTxtPath) && retries-- > 0) {
      await new Promise((r) => setTimeout(r, 200));
    }

    if (!fs.existsSync(transcriptTxtPath)) {
      console.warn(
        '[transcribeAudio] Transcript file missing:',
        transcriptTxtPath,
      );
      return '[empty transcription]';
    }

    console.log(
      '[DEBUG] Transcript file exists:',
      fs.existsSync(transcriptTxtPath),
    );
    console.log('[DEBUG] Transcript file path:', transcriptTxtPath);

    const transcript = fs.readFileSync(transcriptTxtPath, 'utf-8');
    console.log('[DEBUG] Transcript file content:', transcript);
    return transcript;
  } catch (err) {
    console.error('[transcribeAudio] Error:', err);
    return '';
  }
};
