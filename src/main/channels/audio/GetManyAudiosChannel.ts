import { GET_MANY_AUDIOS_CHANNEL } from '@shared/channels';
import { GetManyAudiosParams } from '@shared/interfaces/Audio';
import { instanceToPlain } from 'class-transformer';
import { IpcMainEvent } from 'electron';
import log from 'electron-log/main';
import { existsSync, promises as fs } from 'fs';
import * as path from 'path';

import { IpcRequest } from '../../../shared/interfaces/IpcRequest';
import { AppDataSource } from '../../data-source';
import { Audio } from '../../entity/Audio';
import { IpcChannel } from '../../interfaces/IpcChannel';
import { GetOneChannel } from '../common/GetOneChannel';

export class GetManyAudioChannel implements IpcChannel {
  getName(): string {
    return GET_MANY_AUDIOS_CHANNEL;
  }

  async handle(
    event: IpcMainEvent,
    request: IpcRequest<GetManyAudiosParams>,
  ): Promise<void> {
    log.debug(`get many audios channel`);
    log.debug(`handling ${this.getName()}...`);

    if (!request.responseChannel) {
      request.responseChannel = `${this.getName()}:response`;
    }
    if (!request?.params?.messageId) {
      return;
    }
    const audioBuffers: ArrayBuffer[] = [];
    const { messageId } = request.params;
    const messagePath = path.join(
      __dirname,
      '../../src/saved_audios',
      messageId,
    );
    log.debug('Message path:', messagePath);
    if (!existsSync(messagePath)) {
      log.debug('Directory does not exist:', messagePath);
    }

    try {
      // Read all file names in the directory
      const fileNames = await fs.readdir(messagePath);

      log.debug('Audio file names ', fileNames);

      // Load each file as a Buffer and store it in the audioBuffers array
      for (const fileName of fileNames) {
        const filePath = path.join(messagePath, fileName);
        try {
          const audioBuffer = await fs.readFile(filePath);

          log.debug('Audio buffer of size ', audioBuffer.byteLength);

          audioBuffers.push(audioBuffer);
        } catch (error) {
          log.debug(`Error reading file ${fileName}:`, error);
        }
      }

      // log.debug('Loaded audio buffers:', audioBuffers);
    } catch (error) {
      log.debug('Error reading directory:', error);
    }

    log.debug('Audio buffers of size ', audioBuffers.length);
    event.sender.send(request.responseChannel, instanceToPlain(audioBuffers));
  }
}
