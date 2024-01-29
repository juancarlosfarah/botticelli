import { IpcRequest } from '@shared/interfaces/IpcRequest';
import { instanceToPlain } from 'class-transformer';
import { IpcMainEvent } from 'electron';
import log from 'electron-log/main';

import { START_INTERACTION_CHANNEL } from '../../../shared/channels';
import { AppDataSource } from '../../data-source';
import { Interaction } from '../../entity/Interaction';
import { StartChannel } from '../common/StartChannel';

export class StartInteractionChannel extends StartChannel<Interaction> {
  constructor() {
    super({
      name: START_INTERACTION_CHANNEL,
      entity: Interaction,
    });
  }

  async handle(
    event: IpcMainEvent,
    request: IpcRequest<Interaction>,
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

    const interactionRepository = AppDataSource.getRepository(Interaction);
    const interaction = await interactionRepository.findOneBy({ id });

    if (interaction) {
      interaction.started = true;
      interaction.startedAt = new Date();
      await interactionRepository.save(interaction);
    }

    // todo: error handling

    event.sender.send(request.responseChannel, instanceToPlain(interaction));
  }
}
