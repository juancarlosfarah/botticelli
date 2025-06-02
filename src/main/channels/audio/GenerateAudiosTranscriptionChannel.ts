import { IpcChannel } from '@main/interfaces/IpcChannel';
import { GENERATE_AUDIO_TRANSCRIPTION_CHANNEL } from '@shared/channels';
import { GenerateAudioTranscriptionParams } from '@shared/interfaces/Audio';
import { IpcRequest } from '@shared/interfaces/IpcRequest';
import { instanceToPlain } from 'class-transformer';
import { IpcMainEvent } from 'electron';
import log from 'electron-log/main';

import { transcribeAudio } from '../../utils/transcribeAudio';

export class GenerateAudioTranscriptonChannel implements IpcChannel {
  getName(): string {
    return GENERATE_AUDIO_TRANSCRIPTION_CHANNEL;
  }

  async handle(
    event: IpcMainEvent,
    request: IpcRequest<GenerateAudioTranscriptionParams>,
  ): Promise<void> {
    log.debug(`[${this.getName()}] Handling request`, request);

    if (!request.responseChannel) {
      request.responseChannel = `${this.getName()}:response`;
    }

    const blobPath = request?.params?.blobPath;
    const exchangeId = request?.params?.exchangeId;
    const participantId = request?.params?.participantId;
    const audioId = request?.params?.audioId;

    if (!blobPath || !exchangeId || !participantId || !audioId) {
      log.error(`[${this.getName()}] Missing required parameters`);
      return;
    }

    try {
      const transcription = await transcribeAudio({ blobPath, audioId });
      log.info(`[${this.getName()}] Transcription successful`);
      log.debug(`[${this.getName()}] Transcription result:`, transcription);

      const safeContent =
        typeof transcription === 'string'
          ? transcription
          : JSON.stringify(transcription);

      /*       event.sender.send('message:post', {
        exchangeId,
        content: safeContent,
        inputType: 'Audio',
        sender: {
          id: participantId,
          type: 'user',
        },
      }); */

      event.sender.send(
        request.responseChannel,
        instanceToPlain(transcription),
      );
    } catch (err: any) {
      log.error(`[${this.getName()}] Transcription failed:`, err);
      event.sender.send(request.responseChannel, {
        error: 'Transcription failed',
        detail: err.message,
      });
    }
  }
}
