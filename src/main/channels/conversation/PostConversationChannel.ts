import { instanceToPlain } from 'class-transformer';
import { IpcMainEvent } from 'electron';
import log from 'electron-log/main';

import { POST_CONVERSATION_CHANNEL } from '../../../shared/channels';
import { IpcRequest } from '../../../shared/interfaces/IpcRequest';
import { AppDataSource } from '../../data-source';
import { Agent } from '../../entity/Agent';
import { Conversation } from '../../entity/Conversation';
import { Trigger } from '../../entity/Trigger';
import { PostOneChannel } from '../common/PostOneChannel';

export class PostConversationChannel extends PostOneChannel {
  constructor() {
    super({ name: POST_CONVERSATION_CHANNEL, entity: Conversation });
  }

  async handle(event: IpcMainEvent, request: IpcRequest): Promise<void> {
    log.debug(`handling ${this.getName()}...`);

    if (!request.responseChannel) {
      request.responseChannel = `${this.getName()}:response`;
    }

    const {
      name,
      description,
      instructions,
      assistant,
      participant,
      triggers,
    } = request.params;

    log.debug(`linking triggers: ${triggers}`);

    const conversation = new Conversation();
    conversation.name = name;
    conversation.description = description;
    conversation.instructions = instructions;

    const agentRepository = AppDataSource.getRepository(Agent);
    const savedAssistant = await agentRepository.findOneBy({ id: assistant });
    const savedParticipant = await agentRepository.findOneBy({
      id: participant,
    });
    if (savedAssistant) {
      conversation.assistant = savedAssistant;
    }
    if (savedParticipant) {
      conversation.participant = savedParticipant;
    }

    // todo: array should come from the front end
    const triggerRepository = AppDataSource.getRepository(Trigger);
    const savedTrigger = await triggerRepository.findOneBy({ id: triggers });
    if (savedTrigger) {
      conversation.triggers = [savedTrigger];
    }

    await AppDataSource.manager.save(conversation);
    event.sender.send(request.responseChannel, instanceToPlain(conversation));
  }
}
