import { START_EXCHANGE_CHANNEL } from '@shared/channels';
import { IpcRequest } from '@shared/interfaces/IpcRequest';
import { instanceToPlain } from 'class-transformer';
import { IpcMainEvent } from 'electron';
import log from 'electron-log/main';

import { AppDataSource } from '../../data-source';
import { Exchange } from '../../entity/Exchange';
import { StartChannel } from '../common/StartChannel';

export class StartExchangeChannel extends StartChannel<Exchange> {
  constructor() {
    super({
      name: START_EXCHANGE_CHANNEL,
      entity: Exchange,
    });
  }

  async handle(
    event: IpcMainEvent,
    request: IpcRequest<Exchange>,
  ): Promise<void> {
    log.debug(`handling ${this.getName()}...`);

    if (!request.responseChannel) {
      request.responseChannel = `${this.getName()}:response`;
    }

    // todo: error handling
    if (!request.params) {
      return;
    }

    const { id } = request.params;

    const query = { id };

    const repository = AppDataSource.getRepository(this.entity);
    const instances = await repository.find({
      where: {
        ...query,
      },
      relations: { triggers: true, interaction: true },
      take: 1,
    });

    const exchange = instances?.length ? instances[0] : null;

    if (exchange) {
      exchange.started = true;
      exchange.startedAt = new Date();
      await repository.save(exchange);
    }

    // todo: error handling

    event.sender.send(request.responseChannel, instanceToPlain(exchange));
  }
}
