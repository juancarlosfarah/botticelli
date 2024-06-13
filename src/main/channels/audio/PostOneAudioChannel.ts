import { IpcChannel } from '@main/interfaces/IpcChannel';
import { POST_ONE_AUDIO_CHANNEL } from '@shared/channels';
import { GenerateAudioTranscriptionHandlerParams } from '@shared/interfaces/Audio';
import { PostOneAudioHandlerParams } from '@shared/interfaces/Audio';
import { IpcRequest } from '@shared/interfaces/IpcRequest';
import { instanceToPlain } from 'class-transformer';
import { IpcMainEvent, app, ipcRenderer } from 'electron';
import log from 'electron-log/main';
import * as fs from 'fs';
import * as path from 'path';

import { AppDataSource } from '../../data-source';
import { Audio } from '../../entity/Audio';
import { Exchange } from '../../entity/Exchange';
import { PostOneChannel } from '../common/PostOneChannel';

async function saveAudio(
  arrayBuffer: ArrayBuffer,
  filename: string,
): Promise<string> {
  const buffer = Buffer.from(arrayBuffer);
  const filePath = path.join(__dirname, '../../src/saved_audios', filename);

  return new Promise<string>((resolve, reject) => {
    fs.mkdir(
      path.join(__dirname, '../../src/saved_audios'),
      { recursive: true },
      (err) => {
        if (err) {
          return reject(err);
        }
        fs.writeFile(filePath, buffer, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve(filePath);
          }
        });
      },
    );
  });
}

export class PostOneAudioChannel implements IpcChannel {
  getName(): string {
    return POST_ONE_AUDIO_CHANNEL;
  }

  async handle(
    event: IpcMainEvent,
    request: IpcRequest<PostOneAudioHandlerParams>,
  ): Promise<void> {
    log.debug(`post one audio channel`);
    log.debug(`handling ${this.getName()}...`);

    if (!request.responseChannel) {
      request.responseChannel = `${this.getName()}:response`;
    }

    if (!request.params) {
      event.sender.send(request.responseChannel, {});
      return;
    }

    const { exchangeId, blobBuffer } = request.params;

    const audio = new Audio();

    // audio.exchange = exchangeId;

    const audioRepository = AppDataSource.getRepository(Audio);
    const exchangeRepository = AppDataSource.getRepository(Exchange);

    log.debug('before id');
    audio.blobPath = 'initialPath';
    audio.transcription = 'initialTranscription';
    const exchange = await exchangeRepository.findOneBy({ id: exchangeId });
    if (exchange) {
      audio.exchange = exchange;
    }

    const { id } = await audioRepository.save(audio);
    log.debug('after id');

    const fileName = id + '.wav';
    log.debug('file name ' + fileName);

    const blobPath = await saveAudio(blobBuffer, fileName);
    audio.blobPath = blobPath;
    audio.binaryData = Buffer.from(blobBuffer);
    if (audio.binaryData) {
      log.debug('binary data not empty');
    }

    await audioRepository.save(audio);
    const savedResponse = await audioRepository.findOneBy({ id });

    // const savedResponse = await audioRepository.findOneBy({ id });
    event.sender.send(request.responseChannel, instanceToPlain(savedResponse));
  }
}
