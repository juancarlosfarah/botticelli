// config/postbuild.js
const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

function chmodSafe(targetPath, label) {
  try {
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
    path.resolve('resources/whisper-bin/win/main.exe'),
    path.join(distResources, 'whisper-bin/win/main.exe'),
  );
}

// Whisper model
copy(
  path.resolve('resources/models/ggml-base.bin'),
  path.join(distResources, 'models/ggml-base.bin'),
);
