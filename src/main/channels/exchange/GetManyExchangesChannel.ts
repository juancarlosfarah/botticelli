import { instanceToPlain } from 'class-transformer';
import { IpcMainEvent } from 'electron';
import log from 'electron-log/main';

import { GET_MANY_EXCHANGES_CHANNEL } from '../../../shared/channels';
import { IpcRequest } from '../../../shared/interfaces/IpcRequest';
import { AppDataSource } from '../../data-source';
import { Exchange } from '../../entity/Exchange';
import { GetManyChannel } from '../common/GetManyChannel';

export class GetManyExchangesChannel extends GetManyChannel {
  constructor() {
    super({
      name: GET_MANY_EXCHANGES_CHANNEL,
      entity: Exchange,
    });
  }

  async handle(event: IpcMainEvent, request: IpcRequest): Promise<void> {
    log.debug(`handling ${this.name}...`);

    if (!request.responseChannel) {
      request.responseChannel = `${this.name}:response`;
    }

    const repository = AppDataSource.getRepository(this.entity);
    const instances = await repository.find({
      relations: { interaction: true },
    });

    event.sender.send(request.responseChannel, instanceToPlain(instances));
  }
}
