import { IpcRequest } from '@shared/interfaces/IpcRequest';
import { instanceToPlain } from 'class-transformer';
import { IpcMainEvent } from 'electron';
import log from 'electron-log/main';

import { GET_ONE_EXCHANGE_TEMPLATE_CHANNEL } from '../../../shared/channels';
import { AppDataSource } from '../../data-source';
import { ExchangeTemplate } from '../../entity/ExchangeTemplate';
import { GetOneChannel } from '../common/GetOneChannel';

export class GetOneExchangeTemplateChannel extends GetOneChannel {
  constructor() {
    super({
      name: GET_ONE_EXCHANGE_TEMPLATE_CHANNEL,
      entity: ExchangeTemplate,
    });
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
      relations: { triggers: true },
      take: 1,
    });

    const instance = instances?.length ? instances[0] : null;
    // debugging
    log.debug(`got ${this.entity}:`, instance);

    event.sender.send(request.responseChannel, instanceToPlain(instance));
  }
}
