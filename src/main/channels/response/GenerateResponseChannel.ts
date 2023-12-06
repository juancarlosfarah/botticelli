import { instanceToPlain } from 'class-transformer';
import { IpcMainEvent } from 'electron';
import log from 'electron-log/main';
import OpenAi from 'openai';

import { GENERATE_RESPONSE_CHANNEL } from '../../../shared/channels';
import { IpcRequest } from '../../../shared/interfaces/IpcRequest';
import { OPENAI_API_KEY, OPENAI_ORG_ID } from '../../config/env';
import { AppDataSource } from '../../data-source';
import { Exchange } from '../../entity/Exchange';
import { Interaction } from '../../entity/Interaction';
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

    const { exchangeId } = request.params;

    // debug
    log.debug(`generating response for exchange:`, exchangeId);

    // get repositories
    const exchangeRepository = AppDataSource.getRepository(Exchange);
    const messageRepository = AppDataSource.getRepository(Message);
    const interactionRepository = AppDataSource.getRepository(Interaction);

    // get exchange
    const instances = await exchangeRepository.find({
      where: { id: exchangeId },
      relations: { triggers: true, interaction: true },
      take: 1,
    });
    const exchange = instances?.length ? instances[0] : null;

    // todo: handle null exchange

    const instructions = exchange?.instructions || '';

    const assistant = exchange?.assistant;

    const messages = await messageRepository.findBy({
      exchange: { id: exchangeId },
    });

    // transform messages to prompt format
    const prompt = messagesToPrompt(messages);

    //
    const openAi = new OpenAi({
      organization: OPENAI_ORG_ID,
      apiKey: OPENAI_API_KEY,
    });

    // evaluate
    const triggers = exchange?.triggers || [];

    // completing exchange manually
    log.debug(`evaluating exchange`, exchangeId);
    const evaluations: string[] = [];

    if (triggers.length === 0) {
      log.warn(`empty triggers`);
    }
    for (const trigger of triggers) {
      log.debug(`evaluating trigger`, trigger.id);
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
      // completing exchange manually
      log.debug(`evaluation result:`, evaluation);
      if (evaluation === 'Yes') {
        completed = true;
      }
    });

    if (completed) {
      // completing exchange manually
      log.debug(`manually completing exchange`, exchangeId);

      exchange.completed = true;
      await exchangeRepository.save(exchange);

      const interaction = await interactionRepository.findOneBy({
        id: exchange.interaction.id,
      });

      if (interaction) {
        interaction.currentExchange = exchange.next;
        if (!exchange.next) {
          interaction.completed = true;
        }
        await interactionRepository.save(interaction);
      }

      // const response = new Message();
      // response.content = 'Thank you!';
      // response.exchange = exchangeId;
      // if (assistant) {
      //   response.sender = assistant;
      // }
      // const { id } = await messageRepository.save(response);
      // const savedMessage = await messageRepository.findOneBy({ id });
      //
      // // debug
      // log.debug(`manually completed exchange:`, savedMessage);
      event.sender.send(request.responseChannel, null);
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
      response.exchange = exchangeId;

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
