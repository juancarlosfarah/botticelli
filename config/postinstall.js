// config/postinstall.js
const fs = require('fs');
const path = require('path');

const platform = process.platform;
const binaryName = platform === 'win32' ? 'main.exe' : 'main';

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
  console.warn('[POSTINSTALL] Binary not found at source, but might already exist in resources. Skipping copy.');
  return;
}


fs.mkdirSync(path.dirname(binaryTarget), { recursive: true });
fs.copyFileSync(binarySource, binaryTarget);
fs.chmodSync(binaryTarget, 0o755);

console.log('[POSTINSTALL] Whisper binary copied to:', binaryTarget);
