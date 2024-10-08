import { IpcRequest } from '@shared/interfaces/IpcRequest';
import { instanceToPlain } from 'class-transformer';
import { IpcMainEvent } from 'electron';
import log from 'electron-log/main';

import { GET_ONE_EXCHANGE_CHANNEL } from '../../../shared/channels';
import { AppDataSource } from '../../data-source';
import { Exchange } from '../../entity/Exchange';
import { GetOneChannel } from '../common/GetOneChannel';

export class GetOneExchangeChannel extends GetOneChannel {
  constructor() {
    super({ name: GET_ONE_EXCHANGE_CHANNEL, entity: Exchange });
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
