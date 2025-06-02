import { app } from 'electron';
import fs from 'fs';
import path from 'path';

/**
 * Returns a safe, writable path inside the user's app data directory.
 * Automatically creates directories if needed.
 */
export function getUserAudioPath(subpath: string = ''): string {
  const base = path.join(app.getPath('userData'), 'saved_audios');
  if (!fs.existsSync(base)) {
    fs.mkdirSync(base, { recursive: true });
  }
  return subpath ? path.join(base, subpath) : base;
}
