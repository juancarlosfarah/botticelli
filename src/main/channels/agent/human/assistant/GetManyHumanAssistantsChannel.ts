import { AppDataSource } from '@main/data-source';
import { HumanAssistant } from '@main/entity/HumanAssistant';
import { GET_MANY_HUMAN_ASSISTANTS_CHANNEL } from '@shared/channels';
import { IpcRequest } from '@shared/interfaces/IpcRequest';
import { instanceToPlain } from 'class-transformer';
import { IpcMainEvent } from 'electron';

import { GetManyChannel } from '../../../common/GetManyChannel';

export class GetManyHumanAssistantsChannel extends GetManyChannel {
  constructor() {
    super({
      name: GET_MANY_HUMAN_ASSISTANTS_CHANNEL,
      entity: HumanAssistant,
    });
  }

  async handle(event: IpcMainEvent, request: IpcRequest): Promise<void> {
    if (!request.responseChannel) {
      request.responseChannel = `${this.getName()}:response`;
    }

    const { email } = request.params;

    if (!email) {
      event.sender.send(request.responseChannel, { agents: [] });
      return;
    }

    const agentRepository = AppDataSource.getRepository(HumanAssistant);

    try {
      const agents = await agentRepository.find({
        where: { email },
      });

      event.sender.send(request.responseChannel, {
        agents: instanceToPlain(agents),
      });
    } catch (error) {
      event.sender.send(request.responseChannel, {
        error: `Failed to retrieve human assistants: ${error.message}`,
        agents: [],
      });
    }
  }
}
