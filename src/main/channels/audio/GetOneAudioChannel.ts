import { GET_ONE_AUDIO_CHANNEL } from '@shared/channels';
import { instanceToPlain } from 'class-transformer';
import log from 'electron-log/main';

import { AppDataSource } from '../../data-source';
import { Audio } from '../../entity/Audio';
import { GetOneChannel } from '../common/GetOneChannel';

export class GetOneAudioChannel extends GetOneChannel {
  constructor() {
    super({ name: GET_ONE_AUDIO_CHANNEL, entity: Audio });
  }

  async handle(event: IpcMainEvent, request: IpcRequest): Promise<void> {
    log.debug(`handling ${this.name}...`);

    if (!request.responseChannel) {
      request.responseChannel = `${this.name}:response`;
    }

    // todo: error handling
    const query = request?.params?.query;

    // debugging
    log.debug(`using query:`, query);

    const repository = AppDataSource.getRepository(this.entity);
    const instances = await repository.find({
      where: {
        ...query,
      },
      relations: { triggers: true, interaction: true },
      take: 1,
    });

    const instance = instances?.length ? instances[0] : null;
    // debugging
    log.debug(`got exchange ${instance?.id}`);

    event.sender.send(request.responseChannel, instanceToPlain(instance));
  }
}
