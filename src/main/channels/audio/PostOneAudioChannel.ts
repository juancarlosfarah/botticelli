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
import { PostOneChannel } from '../common/PostOneChannel';

const saveAudio = async (blob: Blob, filename: string): Promise<string> => {
  const audioBuffer = await blob.arrayBuffer();

  const userPath = app.getPath('userData');
  console.log('user path ' + userPath);

  const filePath = path.join(userPath, 'newAudiosFolder', filename);

  try {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, Buffer.from(new Uint8Array(audioBuffer)));
    return filePath;
  } catch (error) {
    console.error('Failed to save audio:', error);
    return '';
  }
};

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

    const { exchangeId, blob } = request.params;

    const audio = new Audio();

    // audio.exchange = exchangeId;

    const audioRepository = AppDataSource.getRepository(Audio);

    console.log('before id');
    const { id } = await audioRepository.save(audio);
    console.log('after id');

    const fileName = id + '.wav';
    console.log('file name ' + fileName);

    const blobPath = await saveAudio(blob, fileName);
    audio.blobPath = blobPath;
    await audioRepository.save(audio);
    const savedResponse = await audioRepository.findOneBy({ id });

    // const savedResponse = await audioRepository.findOneBy({ id });
    event.sender.send(request.responseChannel, instanceToPlain(savedResponse));
  }
}
