import { AppDataSource } from '@main/data-source';
import { GET_MANY_INTERACTION_TEMPLATES_CHANNEL } from '@shared/channels';
import { IpcRequest } from '@shared/interfaces/IpcRequest';
import { instanceToPlain } from 'class-transformer';
import { IpcMainEvent } from 'electron';

import { InteractionTemplate } from '../../entity/InteractionTemplate';
import { GetManyChannel } from '../common/GetManyChannel';

export class GetManyInteractionTemplatesChannel extends GetManyChannel {
  constructor() {
    super({
      name: GET_MANY_INTERACTION_TEMPLATES_CHANNEL,
      entity: InteractionTemplate,
    });
  }

  async handle(event: IpcMainEvent, request: IpcRequest): Promise<void> {
    if (!request.responseChannel) {
      request.responseChannel = `${this.getName()}:response`;
    }

    const { email } = request.params;

    if (!email) {
      event.sender.send(request.responseChannel, { interactionTemplates: [] });
      return;
    }
    try {
      const interactionTemplatesRepository =
        AppDataSource.getRepository(InteractionTemplate);

      const interactionTemplates = await interactionTemplatesRepository.find({
        where: { email },
      });

      event.sender.send(
        request.responseChannel,
        instanceToPlain(interactionTemplates),
      );
    } catch (error) {
      event.sender.send(request.responseChannel, {
        error: 'Failed to fetch interaction templates',
      });
    }
  }
}
