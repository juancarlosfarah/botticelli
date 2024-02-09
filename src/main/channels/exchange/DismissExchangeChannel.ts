import { DISMISS_EXCHANGE_CHANNEL } from '@shared/channels';
import { IpcRequest } from '@shared/interfaces/IpcRequest';
import { instanceToPlain } from 'class-transformer';
import { IpcMainEvent } from 'electron';
import log from 'electron-log/main';

import { AppDataSource } from '../../data-source';
import { Exchange } from '../../entity/Exchange';
import { Interaction } from '../../entity/Interaction';
import { DismissChannel } from '../common/DismissChannel';

export class DismissExchangeChannel extends DismissChannel<Exchange> {
  constructor() {
    super({
      name: DISMISS_EXCHANGE_CHANNEL,
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
      exchange.dismissed = true;
      exchange.dismissedAt = new Date();
      await repository.save(exchange);

      const interactionRepository = AppDataSource.getRepository(Interaction);
      const interaction = await interactionRepository.findOneBy({
        id: exchange.interaction.id,
      });

      // proceed to the next exchange in the interaction
      if (interaction) {
        interaction.currentExchange = exchange.next;

        // if this is the last exchange, mark the interaction as completed
        if (!exchange.next) {
          interaction.completed = true;
          interaction.completedAt = new Date();
        }
        await interactionRepository.save(interaction);
      }
    }

    // todo: error handling

    event.sender.send(request.responseChannel, instanceToPlain(exchange));
  }
}
