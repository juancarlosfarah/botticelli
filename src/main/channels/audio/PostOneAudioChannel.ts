import { POST_ONE_AUDIO_CHANNEL } from '@shared/channels';
import { instanceToPlain } from 'class-transformer';
import log from 'electron-log/main';

import { AppDataSource } from '../../data-source';
import { Audio } from '../../entity/Audio';
import { PostOneChannel } from '../common/PostOneChannel';

export class PostOneAudioChannel extends PostOneChannel {
  constructor() {
    super({
      name: POST_ONE_AUDIO_CHANNEL,
      entity: Audio,
    });
  }

  async handle(event: IpcMainEvent, request: IpcRequest): Promise<void> {
    log.debug(`handling ${this.getName()}...`);

    if (!request.responseChannel) {
      request.responseChannel = `${this.getName()}:response`;
    }

    const { id, exchange, message, createdAt, updatedAt } = request.params;

    const audio = new Audio();
    audio.id = id;
    audio.exchange = exchange;
    audio.message = message;
    audio.createdAt = createdAt;
    audio.updatedAt = updatedAt;

    const audioRepository = AppDataSource.getRepository(Audio);

    await audioRepository.save(audio);

    event.sender.send(request.responseChannel, instanceToPlain(audio));
  }
}
