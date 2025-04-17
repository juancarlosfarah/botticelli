import { instanceToPlain } from 'class-transformer';
import { IpcMainEvent } from 'electron';
import log from 'electron-log/main';

import { GET_AGENTS_CHANNEL } from '../../../shared/channels';
import { IpcRequest } from '../../../shared/interfaces/IpcRequest';
import { AppDataSource } from '../../data-source';
import { Agent } from '../../entity/Agent';
import { IpcChannel } from '../../interfaces/IpcChannel';

export class GetAgentsChannel implements IpcChannel {
  getName(): string {
    return GET_AGENTS_CHANNEL;
  }

  async handle(event: IpcMainEvent, request: IpcRequest): Promise<void> {
    log.debug(`handling ${this.getName()}...`);

    if (!request.responseChannel) {
      request.responseChannel = `${this.getName()}:response`;
    }
    const { email } = request.params;

    if (!email) {
      log.error('email is missing : can not fulfill get agents request');
      event.sender.send(request.responseChannel, { agents: [] });
      return;
    }

    const agentRepository = AppDataSource.getRepository(Agent);

    const agents = await agentRepository.find({
      where: { email },
    });

    event.sender.send(request.responseChannel, {
      agents: instanceToPlain(agents),
    });
  }
}
