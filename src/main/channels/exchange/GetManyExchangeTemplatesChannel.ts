import { AppDataSource } from '@main/data-source';
import { instanceToPlain } from 'class-transformer';
import { IpcMainEvent } from 'electron';

import { GET_MANY_EXCHANGE_TEMPLATES_CHANNEL } from '../../../shared/channels';
import { ExchangeTemplate } from '../../entity/ExchangeTemplate';
import { GetManyChannel } from '../common/GetManyChannel';

export class GetManyExchangeTemplatesChannel extends GetManyChannel {
  constructor() {
    super({
      name: GET_MANY_EXCHANGE_TEMPLATES_CHANNEL,
      entity: ExchangeTemplate,
    });
  }

  async handle(event: IpcMainEvent, request: IpcRequest): Promise<void> {
    if (!request.responseChannel) {
      request.responseChannel = `${this.getName()}:response`;
    }

    const { email } = request.params;

    if (!email) {
      event.sender.send(request.responseChannel, { agents: [] });
      return;
    }

    const exchangeTemplatesRepository =
      AppDataSource.getRepository(ExchangeTemplate);

    const exchangeTemplates = await exchangeTemplatesRepository.find({
      where: { email },
    });

    event.sender.send(
      request.responseChannel,
      instanceToPlain(exchangeTemplates),
    );
  }
}
