import { IpcChannel } from '@main/interfaces/IpcChannel';
import { DELETE_ONE_AUDIO_CHANNEL } from '@shared/channels';
import { DeleteOneAudioParams } from '@shared/interfaces/Audio';
import { IpcRequest } from '@shared/interfaces/IpcRequest';
import { IpcMainEvent } from 'electron';
import log from 'electron-log/main';
import * as fs from 'fs';
import * as path from 'path';

function deleteAudio(filePath: string) {
  return new Promise((resolve, reject) => {
    fs.unlink(filePath, (err) => {
      if (err) {
        return reject(err);
      } else {
        resolve(filePath);
      }
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
    const initialFilePath = path.join(
      __dirname,
      '../../src/saved_audios',
      audioId + '_resampled.wav',
    );
    deleteAudio(initialFilePath);
    event.sender.send(request.responseChannel, { initialFilePath });
  }
}
