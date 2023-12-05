import { POST_ONE_INTERACTION_CHANNEL } from '@shared/channels';
import { IpcRequest } from '@shared/interfaces/IpcRequest';
import { instanceToPlain } from 'class-transformer';
import { IpcMainEvent } from 'electron';
import log from 'electron-log/main';
import { In } from 'typeorm';

import { AppDataSource } from '../../data-source';
import { Conversation } from '../../entity/Conversation';
import { Interaction } from '../../entity/Interaction';
import { PostOneChannel } from '../common/PostOneChannel';

export class PostOneInteractionChannel extends PostOneChannel {
  constructor() {
    super({
      name: POST_ONE_INTERACTION_CHANNEL,
      entity: Interaction,
    });
  }

  async handle(event: IpcMainEvent, request: IpcRequest): Promise<void> {
    log.debug(`handling ${this.getName()}...`);

    if (!request.responseChannel) {
      request.responseChannel = `${this.getName()}:response`;
    }

    const { description, instructions, name, conversations } = request.params;

    const interaction = new Interaction();
    interaction.name = name;
    interaction.description = description;
    interaction.instructions = instructions;

    const interactionRepository = AppDataSource.getRepository(Interaction);
    const conversationRepository = AppDataSource.getRepository(Conversation);

    log.debug(`linking conversations:`, conversations);
    const savedConversations = await conversationRepository.findBy({
      id: In(conversations),
    });
    interaction.conversations = savedConversations;

    await interactionRepository.save(interaction);

    // const instances = await interactionRepository.find({
    //   where: { id },
    //   relations: { conversations: true },
    //   take: 1,
    // });
    // const instance = instances?.length ? instances[0] : null;

    event.sender.send(request.responseChannel, instanceToPlain(interaction));
  }
}
