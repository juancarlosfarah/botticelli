import { IpcRequest } from '@shared/interfaces/IpcRequest';
import { instanceToPlain } from 'class-transformer';
import { IpcMainEvent } from 'electron';

import { POST_ONE_ARTIFICIAL_PARTICIPANT_CHANNEL } from '../../../../../shared/channels';
import { AppDataSource } from '../../../../data-source';
import { ArtificialParticipant } from '../../../../entity/ArtificialParticipant';
import { PostOneChannel } from '../../../common/PostOneChannel';

export class PostOneArtificialParticipantChannel extends PostOneChannel {
  constructor() {
    super({
      name: POST_ONE_ARTIFICIAL_PARTICIPANT_CHANNEL,
      entity: ArtificialParticipant,
    });
  }

  async handle(event: IpcMainEvent, request: IpcRequest): Promise<void> {
    if (!request.responseChannel) {
      request.responseChannel = `${this.getName()}:response`;
    }

    const { description, name, email } = request.params;

    const agent = new ArtificialParticipant();
    agent.name = name;
    agent.description = description;
    agent.email = email;

    await AppDataSource.manager.save(agent);
    event.sender.send(request.responseChannel, instanceToPlain(agent));
  }
}
