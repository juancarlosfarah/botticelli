import { IpcRequest } from '@shared/interfaces/IpcRequest';
import { instanceToPlain } from 'class-transformer';
import { IpcMainEvent } from 'electron';
import log from 'electron-log/main';

import { GET_ONE_EXCHANGE_TEMPLATE_CHANNEL } from '../../../shared/channels';
import { GetOneExchangeTemplateParams } from '../../../shared/interfaces/ExchangeTemplate';
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

  async handle(
    event: IpcMainEvent,
    request: IpcRequest<GetOneExchangeTemplateParams>,
  ): Promise<void> {
    log.debug(`handling ${this.name}...`);

    if (!request.responseChannel) {
      request.responseChannel = `${this.name}:response`;
    }

    // todo: error handling
    const { params } = request;

    // debugging
    log.debug(`using query: ${params}`);

    const repository = AppDataSource.getRepository(this.entity);
    const instances = await repository.find({
      where: {
        ...params,
      },
      relations: { triggers: true },
      take: 1,
    });

    const instance = instances?.length ? instances[0] : null;

    // debugging
    if (instance) {
      log.debug(`got exchange template ${instance.id}`);
    }

    event.sender.send(request.responseChannel, instanceToPlain(instance));
  }
}
