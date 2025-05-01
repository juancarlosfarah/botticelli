import { AppDataSource } from '@main/data-source';
import { HumanParticipant } from '@main/entity/HumanParticipant';
import { GET_MANY_HUMAN_PARTICIPANTS_CHANNEL } from '@shared/channels';
import { IpcRequest } from '@shared/interfaces/IpcRequest';
import { instanceToPlain } from 'class-transformer';
import { IpcMainEvent } from 'electron';

import { GetManyChannel } from '../../../common/GetManyChannel';

export class GetManyHumanParticipantsChannel extends GetManyChannel {
  constructor() {
    super({
      name: GET_MANY_HUMAN_PARTICIPANTS_CHANNEL,
      entity: HumanParticipant,
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

    const agentRepository = AppDataSource.getRepository(HumanParticipant);

    try {
      const agents = await agentRepository.find({
        where: { email },
      });

      event.sender.send(request.responseChannel, {
        agents: instanceToPlain(agents),
      });
    } catch (error) {
      event.sender.send(request.responseChannel, {
        error: `Failed to retrieve human participants: ${error.message}`,
        agents: [],
      });
    }
  }
}
