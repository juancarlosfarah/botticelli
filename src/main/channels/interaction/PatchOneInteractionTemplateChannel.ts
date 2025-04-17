import { AppDataSource } from '@main/data-source';
import { InteractionTemplate } from '@main/entity/InteractionTemplate';
import { PATCH_ONE_INTERACTION_TEMPLATE_CHANNEL } from '@shared/channels';
import { IpcRequest } from '@shared/interfaces/IpcRequest';
import { instanceToPlain } from 'class-transformer';
import { IpcMainEvent } from 'electron';

import { PatchOneChannel } from '../common/PatchOneChannel';

export class PatchOneInteractionTemplateChannel extends PatchOneChannel {
  constructor() {
    super({
      name: PATCH_ONE_INTERACTION_TEMPLATE_CHANNEL,
      entity: InteractionTemplate,
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

    await AppDataSource.manager.update(InteractionTemplate, id, {
      name,
      description,
    });

    const repository = AppDataSource.getRepository(this.entity);
    const interactionTemplate = await repository.findOneBy({ id });

    event.sender.send(
      request.responseChannel,
      instanceToPlain(interactionTemplate),
    );
  }
}
