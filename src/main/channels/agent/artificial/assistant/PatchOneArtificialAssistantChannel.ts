import { PATCH_ONE_ARTIFICIAL_ASSISTANT_CHANNEL } from '@shared/channels';
import { IpcRequest } from '@shared/interfaces/IpcRequest';
import { instanceToPlain } from 'class-transformer';
import { IpcMainEvent } from 'electron';

import { PatchOneAgentParams } from '../../../../../shared/interfaces/Agent';
import { AppDataSource } from '../../../../data-source';
import { ArtificialAssistant } from '../../../../entity/ArtificialAssistant';
import { PatchOneChannel } from '../../../common/PatchOneChannel';

export class PatchOneArtificialAssistantChannel extends PatchOneChannel {
  constructor() {
    super({
      name: PATCH_ONE_ARTIFICIAL_ASSISTANT_CHANNEL,
      entity: ArtificialAssistant,
    });
  }

  async handle(
    event: IpcMainEvent,
    request: IpcRequest<PatchOneAgentParams>,
  ): Promise<void> {
    if (!request.responseChannel) {
      request.responseChannel = `${this.getName()}:response`;
    }

    // todo: error handling
    if (!request.params) {
      event.sender.send(request.responseChannel, {});
      return;
    }

    const { id, description, name } = request.params;

    // update the agent
    await AppDataSource.manager.update(ArtificialAssistant, id, {
      description,
      name,
    });

    // get the updated agent
    const repository = AppDataSource.getRepository(this.entity);
    const agent = await repository.findOneBy({ id });

    // return the updated agent to the frontend
    event.sender.send(request.responseChannel, instanceToPlain(agent));
  }
}
