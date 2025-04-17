import { instanceToPlain } from 'class-transformer';
import { IpcMainEvent } from 'electron';

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
    if (!request.responseChannel) {
      request.responseChannel = `${this.getName()}:response`;
    }

    const { email } = request.params;

    if (!email) {
      event.sender.send(request.responseChannel, { exchanges: [] });
      return;
    }

    try {
      const exchangeRepository = AppDataSource.getRepository(Exchange);

      const exchanges = await exchangeRepository.find({
        where: { email },
      });

      event.sender.send(request.responseChannel, {
        exchanges: instanceToPlain(exchanges),
      });
    } catch (error) {
      console.error('Error fetching exchanges:', error);
      event.sender.send(request.responseChannel, {
        exchanges: [],
        error: 'Failed to fetch exchanges',
      });
    }
  }
}
