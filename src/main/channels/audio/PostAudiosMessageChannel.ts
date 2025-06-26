import { Message } from '@main/entity/Message';
import { getUserAudioPath } from '@main/utils/path';
import { POST_AUDIOS_CHANNEL } from '@shared/channels';
import { instanceToPlain } from 'class-transformer';
import { IpcMainEvent } from 'electron';
import log from 'electron-log/main';
import * as fs from 'fs';
import * as path from 'path';

import { PostManyAudiosParams } from '../../../shared/interfaces/Audio';
import { IpcRequest } from '../../../shared/interfaces/IpcRequest';
import { AppDataSource } from '../../data-source';
import { Audio } from '../../entity/Audio';
import { IpcChannel } from '../../interfaces/IpcChannel';

function moveAudioFile(audioId: string, messageId: string): Promise<string> {
  const initialFilePath = getUserAudioPath(`${audioId}_resampled.wav`);
  log.debug('[moveAudioFile] Looking for:', initialFilePath);
  log.debug('[moveAudioFile] File exists:', fs.existsSync(initialFilePath));
  const targetDir = getUserAudioPath(messageId);

  return new Promise((resolve, reject) => {
    fs.readFile(initialFilePath, (err, buffer) => {
      if (err) {
        log.error('Failed to read source audio:', initialFilePath, err);
        return reject(err);
      }

      fs.mkdir(targetDir, { recursive: true }, (err) => {
        if (err) return reject(err);

        const targetPath = getUserAudioPath(
          path.join(messageId, `${audioId}.webm`),
        );

        fs.writeFile(targetPath, buffer, (err) => {
          if (err) return reject(err);

          // cleanup after copying
          fs.unlink(initialFilePath, (err) => {
            if (err) {
              log.warn('Failed to delete temp resampled file:', err.message);
            }
            resolve(targetPath);
          });
        });
      });
    });
  });
}

export class PostManyAudiosChannel implements IpcChannel {
  getName(): string {
    return POST_AUDIOS_CHANNEL;
  }

  async handle(
    event: IpcMainEvent,
    request: IpcRequest<PostManyAudiosParams>,
  ): Promise<void> {
    // debug
    log.debug(`handling ${this.getName()}...`);

    if (!request.responseChannel) {
      request.responseChannel = `${this.getName()}:response`;
    }

    // todo: return error
    if (!request.params) {
      event.sender.send(request.responseChannel, {});
      return;
    }

    const { message, savedAudios } = request.params;

    // debug
    log.debug(`getting audios for message:`, message.id);

    const audioRepository = AppDataSource.getRepository(Audio);
    const messageRepository = AppDataSource.getRepository(Message);

    const myMessage = await messageRepository.findOneBy({ id: message.id });

    const audios: Audio[] = [];
    for (const audio of savedAudios) {
      const audioEntity = await audioRepository.findOneBy({ id: audio.id });
      if (audioEntity && myMessage) {
        audios.push(audioEntity);
        audioEntity.message = myMessage;
        await audioRepository.save(audioEntity);
        const targetDir = getUserAudioPath(myMessage.id);
        const targetFilePath = path.join(targetDir, `${audioEntity.id}.webm`);
        audioEntity.blobPath = targetFilePath;
        const savedPath = await moveAudioFile(audioEntity.id, myMessage.id);
        audioEntity.blobPath = savedPath;
        log.debug('Moved audio to:', savedPath);

        await messageRepository.save(myMessage);

        log.debug('target dir ', targetDir);
      } else {
        log.debug('no audio or no message');
      }
    }

    log.debug(`audios of length `, audios.length);
    log.debug(`post audios message: `, myMessage?.content);

    event.sender.send(request.responseChannel, instanceToPlain(audios));
  }
}
