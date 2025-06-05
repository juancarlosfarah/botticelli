// config/postbuild.js
/**
 * This script copies required binaries (like whisper, FFmpeg) and model files into the final .app bundle after the build.
 *
 * Electron Builder doesnt preserve executable permissions or include external binaries by default, so
 * this script:
 * - locates the .app bundle
 * - resolves the internal Resources path
 * - copies the necessary binaries and model files into expected runtime locations
 
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

function chmodSafe(targetPath, label) {
  try {
    // 0o755 = means we set file permissions so the owner can read, write and execute the binaries
    // required because packaging may change permissions from binaries
    fs.chmodSync(targetPath, 0o755);
  } catch (err) {
    console.error(`[postbuild] Failed to chmod ${label}:`, err.message);
  }
}

function copy(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
  chmodSafe(dest, path.basename(dest));
}

// Try both casing variations for .app folder
const distAppName = fs.existsSync(
  path.join(__dirname, '..', 'dist', 'mac', 'botticelli.app'),
)
  ? 'botticelli.app'
  : 'Botticelli.app';

const appPath = path.join(__dirname, '..', 'dist', 'mac', distAppName);

// Binaries & Resources folder inside .app
const distResources = path.join(appPath, 'Contents', 'Resources');

// Whisper binary
const whisperBinary = path.join(distResources, 'whisper-bin', 'darwin', 'main');
chmodSafe(whisperBinary, 'Whisper binary');

// FFmpeg binary
const ffmpegSrc = path.resolve('resources/ffmpeg');
const ffmpegDest = path.join(distResources, 'ffmpeg');

if (fs.existsSync(ffmpegSrc)) {
  copy(ffmpegSrc, ffmpegDest);
} else {
  console.error('[postbuild] FFmpeg not found at:', ffmpegSrc);
}

// Whisper binaries per platform
const platform = os.platform();
if (platform === 'darwin') {
  copy(
    path.resolve('resources/whisper-bin/darwin/main'),
    path.join(distResources, 'whisper-bin/darwin/main'),
  );
} else if (platform === 'linux') {
  copy(
    path.resolve('resources/whisper-bin/linux/main'),
    path.join(distResources, 'whisper-bin/linux/main'),
  );
} else if (platform === 'win32') {
  copy(
    path.resolve('resources/whisper-bin/win32/main.exe'),
    path.join(distResources, 'whisper-bin/win32/main.exe'),
  );
}

// Whisper model
copy(
  path.resolve('resources/models/ggml-base.bin'),
  path.join(distResources, 'models/ggml-base.bin'),
);
