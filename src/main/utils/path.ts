import { app } from 'electron';
import fs from 'fs';
import path from 'path';

/**
 * Returns a safe, writable path inside the user's app data directory.
 * Automatically creates directories if needed.
 */

const SAVED_AUDIOS_DIR_NAME = 'saved_audios';

export function getUserAudioPath(subpath: string = ''): string {
  const base = path.join(app.getPath('userData'), SAVED_AUDIOS_DIR_NAME);
  if (!fs.existsSync(base)) {
    fs.mkdirSync(base, { recursive: true });
  }
  return subpath ? path.join(base, subpath) : base;
}
