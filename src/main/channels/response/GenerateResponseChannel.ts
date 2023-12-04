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
import { messagesToText } from '../../utils/messagesToText';

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

    // get repositories
    const conversationRepository = AppDataSource.getRepository(Conversation);
    const messageRepository = AppDataSource.getRepository(Message);

    // get conversation
    const instances = await conversationRepository.find({
      where: { id: conversationId },
      relations: { triggers: true },
      take: 1,
    });
    const conversation = instances?.length ? instances[0] : null;

    // todo: handle null conversation

    const instructions = conversation?.instructions || '';

    const assistant = conversation?.assistant;

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

    // evaluate
    const triggers = conversation?.triggers || [];

    // completing conversation manually
    log.debug(`evaluating conversation`, conversationId);
    const evaluations: string[] = [];
    for (const trigger of triggers) {
      const evaluator = trigger.evaluator;
      const criteria = trigger.criteria;
      const evaluation = await openAi.chat.completions.create({
        messages: [
          { role: 'system', content: evaluator.description },
          { role: 'user', content: criteria },
          {
            role: 'user',
            content: `Assistant's Description: ${assistant.description}`,
          },
          { role: 'user', content: `Instructions: ${instructions}` },
          {
            role: 'user',
            content: `Conversation: ${messagesToText(messages)}`,
          },
        ],
        model: 'gpt-3.5-turbo',
      });
      evaluations.push(evaluation.choices[0].message.content || '');
    }

    let completed = false;
    evaluations.forEach((evaluation) => {
      // completing conversation manually
      log.debug(`evaluation result:`, evaluation);
      if (evaluation === 'Yes') {
        completed = true;
      }
    });

    if (completed) {
      // completing conversation manually
      log.debug(`manually completing conversation`, conversationId);

      conversation.completed = true;
      await conversationRepository.save(conversation);

      const response = new Message();
      response.content = 'Thank you!';
      response.conversation = conversationId;
      if (assistant) {
        response.sender = assistant;
      }
      const { id } = await messageRepository.save(response);
      const savedMessage = await messageRepository.findOneBy({ id });

      // debug
      log.debug(`manually completed conversation:`, savedMessage);
      event.sender.send(request.responseChannel, instanceToPlain(savedMessage));
    } else {
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
}
