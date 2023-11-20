import { POST_ONE_HUMAN_ASSISTANT_CHANNEL } from '@shared/channels';
import { IpcRequest } from '@shared/interfaces/IpcRequest';
import { instanceToPlain } from 'class-transformer';
import { IpcMainEvent } from 'electron';

import { AppDataSource } from '../../../../data-source';
import { HumanAssistant } from '../../../../entity/HumanAssistant';
import { PostOneChannel } from '../../../common/PostOneChannel';

export class PostOneHumanAssistantChannel extends PostOneChannel {
  constructor() {
    super({
      name: POST_ONE_HUMAN_ASSISTANT_CHANNEL,
      entity: HumanAssistant,
    });
  }

  async handle(event: IpcMainEvent, request: IpcRequest): Promise<void> {
    if (!request.responseChannel) {
      request.responseChannel = `${this.getName()}:response`;
    }

    const { description, name } = request.params;

    const agent = new HumanAssistant();
    agent.name = name;
    agent.description = description;

    await AppDataSource.manager.save(agent);
    event.sender.send(request.responseChannel, instanceToPlain(agent));
  }
}
