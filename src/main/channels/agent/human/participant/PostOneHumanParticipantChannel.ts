import { IpcRequest } from '@shared/interfaces/IpcRequest';
import { instanceToPlain } from 'class-transformer';
import { IpcMainEvent } from 'electron';

import { POST_ONE_HUMAN_PARTICIPANT_CHANNEL } from '../../../../../shared/channels';
import { AppDataSource } from '../../../../data-source';
import { HumanParticipant } from '../../../../entity/HumanParticipant';
import { PostOneChannel } from '../../../common/PostOneChannel';

export class PostOneHumanParticipantChannel extends PostOneChannel {
  constructor() {
    super({
      name: POST_ONE_HUMAN_PARTICIPANT_CHANNEL,
      entity: HumanParticipant,
    });
  }

  async handle(event: IpcMainEvent, request: IpcRequest): Promise<void> {
    if (!request.responseChannel) {
      request.responseChannel = `${this.getName()}:response`;
    }

    const { description, name, email } = request.params;

    const agent = new HumanParticipant();
    agent.name = name;
    agent.description = description;
    agent.email = email;

    await AppDataSource.manager.save(agent);
    event.sender.send(request.responseChannel, instanceToPlain(agent));
  }
}
