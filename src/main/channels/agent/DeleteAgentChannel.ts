import { instanceToPlain } from 'class-transformer';
import { IpcMainEvent } from 'electron';
import log from 'electron-log/main';

import { DELETE_AGENT_CHANNEL } from '../../../shared/channels';
import { IpcRequest } from '../../../shared/interfaces/IpcRequest';
import { AppDataSource } from '../../data-source';
import { Agent } from '../../entity/Agent';
import { IpcChannel } from '../../interfaces/IpcChannel';

export class DeleteAgentChannel implements IpcChannel {
  getName(): string {
    return DELETE_AGENT_CHANNEL;
  }

  async handle(event: IpcMainEvent, request: IpcRequest): Promise<void> {
    if (!request.responseChannel) {
      request.responseChannel = `${this.getName()}:response`;
    }
    const { id } = request.params;

    // debugging
    log.debug(`handling delete agent:`, id);

    const agent = await AppDataSource.manager.delete(Agent, { id });
    event.sender.send(request.responseChannel, instanceToPlain(agent));
  }
}
