import { instanceToPlain } from 'class-transformer';
import { IpcMainEvent } from 'electron';

import { POST_AGENT_CHANNEL } from '../../../shared/channels';
import { IpcRequest } from '../../../shared/interfaces/IpcRequest';
import { AppDataSource } from '../../data-source';
import { Agent } from '../../entity/Agent';
import { IpcChannel } from '../../interfaces/IpcChannel';
import { log } from 'console';

export class PostAgentChannel implements IpcChannel {
  getName(): string {
    return POST_AGENT_CHANNEL;
  }

  async handle(event: IpcMainEvent, request: IpcRequest): Promise<void> {
    if (!request.responseChannel) {
      request.responseChannel = `${this.getName()}:response`;
    }

    const { description, name, type, avatarURL } = request.params;

    const agent = new Agent();
    agent.name = name;
    agent.description = description;
    agent.type = type;
    // agent.socialCues = [];
    agent.avatarURL = avatarURL

    await AppDataSource.manager.save(agent);
    event.sender.send(request.responseChannel, instanceToPlain(agent));
  }
}
