import { AppDataSource } from '@main/data-source';
import { ArtificialAssistant } from '@main/entity/ArtificialAssistant';
import { GET_MANY_ARTIFICIAL_ASSISTANTS_CHANNEL } from '@shared/channels';
import { IpcRequest } from '@shared/interfaces/IpcRequest';
import { instanceToPlain } from 'class-transformer';
import { IpcMainEvent } from 'electron';

import { GetManyChannel } from '../../../common/GetManyChannel';

export class GetManyArtificialAssistantsChannel extends GetManyChannel {
  constructor() {
    super({
      name: GET_MANY_ARTIFICIAL_ASSISTANTS_CHANNEL,
      entity: ArtificialAssistant,
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

    const agentRepository = AppDataSource.getRepository(ArtificialAssistant);

    try {
      const agents = await agentRepository.find({
        where: { email },
      });

      event.sender.send(request.responseChannel, {
        agents: instanceToPlain(agents),
      });
    } catch (error) {
      event.sender.send(request.responseChannel, {
        error: `Failed to retrieve artificial assistants: ${error.message}`,
        agents: [],
      });
    }
  }
}
