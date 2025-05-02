import { IpcChannel } from '@main/interfaces/IpcChannel';
import { GENERATE_AUDIO_TRANSCRIPTION_CHANNEL } from '@shared/channels';
import { GenerateAudioTranscriptionParams } from '@shared/interfaces/Audio';
import { IpcRequest } from '@shared/interfaces/IpcRequest';
import { instanceToPlain } from 'class-transformer';
import { IpcMainEvent } from 'electron';
import log from 'electron-log/main';

import { AppDataSource } from '../../data-source';
import { Audio } from '../../entity/Audio';
import { transcribeAudio } from '../../utils/transcribeAudio';

export class GenerateAudioTranscriptonChannel implements IpcChannel {
  getName(): string {
    return GENERATE_AUDIO_TRANSCRIPTION_CHANNEL;
  }
  async handle(
    event: IpcMainEvent,
    request: IpcRequest<GenerateAudioTranscriptionParams>,
  ): Promise<void> {
    log.debug(`generate audio transcription channel`);
    log.debug(`handling ${this.getName()}...`);

    if (!request.responseChannel) {
      request.responseChannel = `${this.getName()}:response`;
    }
    if (!request?.params?.blobPath) {
      return;
    }

    const { blobPath } = request.params;

    const transcription = await transcribeAudio(blobPath);
    log.debug('transcription ' + transcription);

    event.sender.send(request.responseChannel, instanceToPlain(transcription));
  }
}
