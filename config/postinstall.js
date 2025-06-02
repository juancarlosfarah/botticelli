// config/postinstall.js
const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

const platform = process.platform;
const binaryName = platform === 'win32' ? 'main.exe' : 'main';

// === Whisper Binary ===
const binarySource = path.resolve(__dirname, '..', 'bin', platform, binaryName);
const binaryTarget = path.resolve(
  __dirname,
  '..',
  'resources',
  'whisper-bin',
  platform,
  binaryName,
);

if (!fs.existsSync(binarySource)) {
  console.warn('[POSTINSTALL] Whisper binary not found, skipping copy.');
} else {
  fs.mkdirSync(path.dirname(binaryTarget), { recursive: true });
  fs.copyFileSync(binarySource, binaryTarget);
  fs.chmodSync(binaryTarget, 0o755);
  console.log('[POSTINSTALL] Whisper binary copied to:', binaryTarget);
}

// === FFmpeg Binary ===
try {
  const ffmpegPath = require('ffmpeg-static');
  const ext = platform === 'win32' ? '.exe' : '';
  const ffmpegTargetDir = path.resolve(
    __dirname,
    '..',
    'resources',
    'ffmpeg',
    platform,
  );
  const ffmpegTarget = path.join(ffmpegTargetDir, `ffmpeg${ext}`);

  fs.mkdirSync(ffmpegTargetDir, { recursive: true });
  fs.copyFileSync(ffmpegPath, ffmpegTarget);
  if (platform !== 'win32') {
    fs.chmodSync(ffmpegTarget, 0o755);
  }
  console.log('[POSTINSTALL] FFmpeg binary copied to:', ffmpegTarget);
} catch (err) {
  console.error('[POSTINSTALL] Failed to copy FFmpeg binary:', err.message);
}

// === Rebuild sqlite3 ===
try {
  console.log('[POSTINSTALL] Rebuilding native module: sqlite3');
  execSync('npx electron-rebuild -f -w sqlite3', { stdio: 'inherit' });
} catch (err) {
  console.error('[POSTINSTALL] Failed to rebuild sqlite3:', err.message);
}
