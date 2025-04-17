import { AppDataSource } from '@main/data-source';
import { Interaction } from '@main/entity/Interaction';
import { PATCH_ONE_INTERACTION_CHANNEL } from '@shared/channels';
import { IpcRequest } from '@shared/interfaces/IpcRequest';
import { instanceToPlain } from 'class-transformer';
import { IpcMainEvent } from 'electron';

import { PatchOneChannel } from '../common/PatchOneChannel';

export class PatchOneInteractionChannel extends PatchOneChannel {
  constructor() {
    super({
      name: PATCH_ONE_INTERACTION_CHANNEL,
      entity: Interaction,
    });
  }

  async handle(event: IpcMainEvent, request: IpcRequest): Promise<void> {
    if (!request.responseChannel) {
      request.responseChannel = `${this.getName()}:response`;
    }

    if (!request.params) {
      event.sender.send(request.responseChannel, {});
      return;
    }

    const { id, name, description } = request.params;

    await AppDataSource.manager.update(Interaction, id, {
      name,
      description,
    });

    const repository = AppDataSource.getRepository(this.entity);
    const interaction = await repository.findOneBy({ id });

    event.sender.send(request.responseChannel, instanceToPlain(interaction));
  }
}
