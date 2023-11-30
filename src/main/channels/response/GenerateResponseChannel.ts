import { instanceToPlain } from 'class-transformer';
import { IpcMainEvent } from 'electron';
import log from 'electron-log/main';
import OpenAi from 'openai';

import { GENERATE_RESPONSE_CHANNEL } from '../../../shared/channels';
import { IpcRequest } from '../../../shared/interfaces/IpcRequest';
import { OPENAI_API_KEY, OPENAI_ORG_ID } from '../../config/env';
import { AppDataSource } from '../../data-source';
import { Conversation } from '../../entity/Conversation';
import { Message } from '../../entity/Message';
import { IpcChannel } from '../../interfaces/IpcChannel';
import { messagesToPrompt } from '../../utils/messagesToPrompt';

export class GenerateResponseChannel implements IpcChannel {
  getName(): string {
    return GENERATE_RESPONSE_CHANNEL;
  }

  async handle(event: IpcMainEvent, request: IpcRequest): Promise<void> {
    // debug
    log.debug(`handling ${this.getName()}...`);

    if (!request.responseChannel) {
      request.responseChannel = `${this.getName()}:response`;
    }

    const { conversationId } = request.params;

    // debug
    log.debug(`generating response for conversation:`, conversationId);

    const conversationRepository = AppDataSource.getRepository(Conversation);
    const messageRepository = AppDataSource.getRepository(Message);

    const conversation = await conversationRepository.findOneBy({
      id: conversationId,
    });
    const instructions = conversation?.instructions || '';

    const assistant = conversation.assistant;

    const messages = await messageRepository.findBy({
      conversation: { id: conversationId },
    });

    // transform messages to prompt format
    const prompt = messagesToPrompt(messages);

    //
    const openAi = new OpenAi({
      organization: OPENAI_ORG_ID,
      apiKey: OPENAI_API_KEY,
    });

    // debug
    log.debug(`requesting completion with instructions:`, instructions);
    log.debug(`assisted by:`, assistant);

    const completion = await openAi.chat.completions.create({
      messages: [
        { role: 'system', content: assistant.description },
        { role: 'system', content: instructions },
        ...prompt,
      ],
      model: 'gpt-3.5-turbo',
    });

    // debug
    log.debug(`received completion:`, completion);

    const response = new Message();
    response.content = completion.choices[0].message.content || '';
    response.conversation = conversationId;

    // todo: make dynamic
    response.sender = assistant;

    const { id } = await messageRepository.save(response);

    const savedMessage = await messageRepository.findOneBy({ id });

    // debug
    log.debug(`generated response:`, savedMessage);
    event.sender.send(request.responseChannel, instanceToPlain(savedMessage));
  }
}
