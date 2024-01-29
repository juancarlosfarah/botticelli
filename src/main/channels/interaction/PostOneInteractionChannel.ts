import { POST_ONE_INTERACTION_CHANNEL } from '@shared/channels';
import { IpcRequest } from '@shared/interfaces/IpcRequest';
import { instanceToPlain } from 'class-transformer';
import { IpcMainEvent } from 'electron';
import log from 'electron-log/main';
import { In } from 'typeorm';

import { AppDataSource } from '../../data-source';
import { Exchange } from '../../entity/Exchange';
import { Interaction } from '../../entity/Interaction';
import { PostOneChannel } from '../common/PostOneChannel';

export class PostOneInteractionChannel extends PostOneChannel {
  constructor() {
    super({
      name: POST_ONE_INTERACTION_CHANNEL,
      entity: Interaction,
    });
  }

  async handle(event: IpcMainEvent, request: IpcRequest): Promise<void> {
    log.debug(`handling ${this.getName()}...`);

    if (!request.responseChannel) {
      request.responseChannel = `${this.getName()}:response`;
    }

    const { description, name, exchanges } = request.params;

    const interaction = new Interaction();
    interaction.name = name;
    interaction.description = description;

    const interactionRepository = AppDataSource.getRepository(Interaction);
    const exchangeRepository = AppDataSource.getRepository(Exchange);

    log.debug(`linking conversations:`, exchanges);
    interaction.exchanges = await exchangeRepository.findBy({
      id: In(exchanges),
    });

    await interactionRepository.save(interaction);

    event.sender.send(request.responseChannel, instanceToPlain(interaction));
  }
}
