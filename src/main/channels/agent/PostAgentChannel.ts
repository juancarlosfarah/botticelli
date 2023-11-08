import { instanceToPlain } from 'class-transformer';
import { IpcMainEvent } from 'electron';

import { POST_AGENT_CHANNEL } from '../../../shared/channels';
import { IpcRequest } from '../../../shared/interfaces/IpcRequest';
import { AppDataSource } from '../../data-source';
import { Agent } from '../../entity/Agent';
import { IpcChannel } from '../../interfaces/IpcChannel';

export class PostAgentChannel implements IpcChannel {
  getName(): string {
    return POST_AGENT_CHANNEL;
  }

  async handle(event: IpcMainEvent, request: IpcRequest): Promise<void> {
    if (!request.responseChannel) {
      request.responseChannel = `${this.getName()}:response`;
    }

    const { description, name, type } = request.params;

    const agent = new Agent();
    agent.name = name;
    agent.description = description;
    agent.type = type;

    await AppDataSource.manager.save(agent);
    event.sender.send(request.responseChannel, instanceToPlain(agent));
  }
}
