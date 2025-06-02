import { IpcChannel } from '@main/interfaces/IpcChannel';
import { getUserAudioPath } from '@main/utils/path';
import { DELETE_ONE_AUDIO_CHANNEL } from '@shared/channels';
import { DeleteOneAudioParams } from '@shared/interfaces/Audio';
import { IpcRequest } from '@shared/interfaces/IpcRequest';
import { IpcMainEvent } from 'electron';
import log from 'electron-log/main';
import fs from 'fs';
import path from 'path';

function deleteAudio(filePath: string) {
  return new Promise((resolve, reject) => {
    fs.unlink(filePath, (err) => {
      if (err) return reject(err);
      resolve(filePath);
    });
  });
}

export class DeleteOneAudioChannel implements IpcChannel {
  getName(): string {
    return DELETE_ONE_AUDIO_CHANNEL;
  }

  async handle(
    event: IpcMainEvent,
    request: IpcRequest<DeleteOneAudioParams>,
  ): Promise<void> {
    log.debug(`delete one audio channel`);
    log.debug(`handling ${this.getName()}...`);

    if (!request.responseChannel) {
      request.responseChannel = `${this.getName()}:response`;
    }

    if (!request.params) {
      event.sender.send(request.responseChannel, {});
      return;
    }

    const { audioId } = request.params;

    const filesToDelete = [
      getUserAudioPath(`${audioId}.wav`),
      getUserAudioPath(`${audioId}_resampled.wav`),
      getUserAudioPath(`${audioId}_resampled.wav.txt`),
    ];

    const deleted: string[] = [];
    const failed: { file: string; error: string }[] = [];

    for (const file of filesToDelete) {
      try {
        await deleteAudio(file);
        log.debug(`Deleted: ${file}`);
        deleted.push(file);
      } catch (err) {
        log.warn(`Failed to delete ${file}:`, err.message);
        failed.push({ file, error: err.message });
      }
    }

    event.sender.send(request.responseChannel, { deleted, failed });
  }
}
