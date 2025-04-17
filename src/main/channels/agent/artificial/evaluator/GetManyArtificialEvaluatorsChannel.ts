import { AppDataSource } from '@main/data-source';
import { ArtificialEvaluator } from '@main/entity/ArtificialEvaluator';
import { GET_MANY_ARTIFICIAL_EVALUATORS_CHANNEL } from '@shared/channels';
import { IpcRequest } from '@shared/interfaces/IpcRequest';
import { instanceToPlain } from 'class-transformer';
import { IpcMainEvent } from 'electron';

import { GetManyChannel } from '../../../common/GetManyChannel';

export class GetManyArtificialEvaluatorsChannel extends GetManyChannel {
  constructor() {
    super({
      name: GET_MANY_ARTIFICIAL_EVALUATORS_CHANNEL,
      entity: ArtificialEvaluator,
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

    const agentRepository = AppDataSource.getRepository(ArtificialEvaluator);

    try {
      const agents = await agentRepository.find({
        where: { email },
      });

      event.sender.send(request.responseChannel, {
        agents: instanceToPlain(agents),
      });
    } catch (error) {
      event.sender.send(request.responseChannel, {
        error: `Failed to retrieve artificial evaluators: ${error.message}`,
        agents: [],
      });
    }
  }
}
