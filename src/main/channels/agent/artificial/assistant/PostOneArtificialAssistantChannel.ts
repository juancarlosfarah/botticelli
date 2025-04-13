import { POST_ONE_ARTIFICIAL_ASSISTANT_CHANNEL } from '@shared/channels';
import { IpcRequest } from '@shared/interfaces/IpcRequest';
import { instanceToPlain } from 'class-transformer';
import { IpcMainEvent } from 'electron';

import { AppDataSource } from '../../../../data-source';
import { ArtificialAssistant } from '../../../../entity/ArtificialAssistant';
import { PostOneChannel } from '../../../common/PostOneChannel';

export class PostOneArtificialAssistantChannel extends PostOneChannel {
  constructor() {
    super({
      name: POST_ONE_ARTIFICIAL_ASSISTANT_CHANNEL,
      entity: ArtificialAssistant,
    });
  }

  async handle(event: IpcMainEvent, request: IpcRequest): Promise<void> {
    if (!request.responseChannel) {
      request.responseChannel = `${this.getName()}:response`;
    }

    const { description, name, email } = request.params;
    // Basic email validation
    if (email && !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      event.sender.send(request.responseChannel, {
        error: 'Invalid email format',
      });
      return;
    }

    const agent = new ArtificialAssistant();
    agent.email = email;
    agent.name = name;
    agent.description = description;

    await AppDataSource.manager.save(agent);
    event.sender.send(request.responseChannel, instanceToPlain(agent));
  }
}
