import { IpcRequest } from '@shared/interfaces/IpcRequest';
import { instanceToPlain } from 'class-transformer';
import { IpcMainEvent } from 'electron';
import log from 'electron-log/main';

import { SET_CURRENT_EXCHANGE_CHANNEL } from '../../../shared/channels';
import { SetCurrentExchangeParams } from '../../../shared/interfaces/Interaction';
import { AppDataSource } from '../../data-source';
import { Interaction } from '../../entity/Interaction';
import { SetChannel } from '../common/SetChannel';

export class SetCurrentExchangeChannel extends SetChannel<SetCurrentExchangeParams> {
  constructor() {
    super({
      name: SET_CURRENT_EXCHANGE_CHANNEL,
      entity: Interaction,
    });
  }

  async handle(
    event: IpcMainEvent,
    // todo: update Interaction to more specific request type
    request: IpcRequest<SetCurrentExchangeParams>,
  ): Promise<void> {
    log.debug(`handling ${this.getName()}...`);

    if (!request.responseChannel) {
      request.responseChannel = `${this.getName()}:response`;
    }

    // todo: error handling
    if (!request.params) {
      return;
    }

    // todo: update request type
    const { interactionId, currentExchangeId } = request.params;

    const interactionRepository = AppDataSource.getRepository(Interaction);
    const interaction = await interactionRepository.findOneBy({
      id: interactionId,
    });

    if (interaction) {
      interaction.currentExchange = currentExchangeId;
      await interactionRepository.save(interaction);
    }

    // todo: error handling

    event.sender.send(request.responseChannel, instanceToPlain(interaction));
  }
}
