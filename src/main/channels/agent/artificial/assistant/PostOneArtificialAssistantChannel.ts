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

    const { description, name } = request.params;

    const agent = new ArtificialAssistant();
    agent.name = name;
    agent.description = description;

    await AppDataSource.manager.save(agent);
    event.sender.send(request.responseChannel, instanceToPlain(agent));
  }
}
