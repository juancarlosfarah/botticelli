import { Message } from '@main/entity/Message';
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

function moveAudioFile(audioId: string, messageId: string) {
  const initialFilePath = path.join(
    __dirname,
    '../../src/saved_audios',
    audioId + '_resampled.wav',
  );
  const targetDir = path.join(__dirname, '../../src/saved_audios', messageId);

  return new Promise((resolve, reject) => {
    // Read the initial file
    fs.readFile(initialFilePath, (err, buffer) => {
      if (err) {
        return reject(err);
      }

      // Ensure the target directory exists
      fs.mkdir(targetDir, { recursive: true }, (err) => {
        if (err) {
          return reject(err);
        }

        const targetFilePath = path.join(targetDir, audioId + '.wav');

        // Write the file to the target directory
        fs.writeFile(targetFilePath, buffer, (err) => {
          if (err) {
            return reject(err);
          }

          // Optionally, delete the initial file after moving
          fs.unlink(initialFilePath, (err) => {
            if (err) {
              return reject(err);
            } else {
              resolve(targetFilePath);
            }
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
        const targetDir = path.join(
          __dirname,
          '../../src/saved_audios',
          myMessage.id,
        );
        const targetFilePath = path.join(targetDir, audioEntity.id + '.wav');
        audioEntity.blobPath = targetFilePath;
        moveAudioFile(audioEntity.id, myMessage.id);
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
