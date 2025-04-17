import { AppDataSource } from '@main/data-source';
import { GET_MANY_INTERACTIONS_CHANNEL } from '@shared/channels';
import { IpcRequest } from '@shared/interfaces/IpcRequest';
import { instanceToPlain } from 'class-transformer';
import { IpcMainEvent } from 'electron';

import { Interaction } from '../../entity/Interaction';
import { GetManyChannel } from '../common/GetManyChannel';

export class GetManyInteractionsChannel extends GetManyChannel {
  constructor() {
    super({
      name: GET_MANY_INTERACTIONS_CHANNEL,
      entity: Interaction,
    });
  }

  async handle(event: IpcMainEvent, request: IpcRequest): Promise<void> {
    if (!request.responseChannel) {
      request.responseChannel = `${this.getName()}:response`;
    }

    const { email } = request.params;

    if (!email) {
      event.sender.send(request.responseChannel, { interactions: [] });
      return;
    }

    try {
      const interactionRepository = AppDataSource.getRepository(Interaction);

      const interactions = await interactionRepository.find({
        where: { email },
      });

      event.sender.send(request.responseChannel, {
        interactions: instanceToPlain(interactions),
      });
    } catch (error) {
      console.error('Error fetching interactions:', error);
      event.sender.send(request.responseChannel, {
        interactions: [],
        error: 'Failed to fetch interactions',
      });
    }
  }
}
