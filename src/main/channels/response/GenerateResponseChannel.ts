import { GENERATE_RESPONSE_CHANNEL } from '@shared/channels';
import { IpcRequest } from '@shared/interfaces/IpcRequest';
import { GenerateResponseParams } from '@shared/interfaces/Message';
import { instanceToPlain } from 'class-transformer';
import { IpcMainEvent } from 'electron';
import log from 'electron-log/main';
import OpenAi, { OpenAI } from 'openai';

import { OPENAI_API_KEY, OPENAI_ORG_ID } from '../../config/env';
import { AppDataSource } from '../../data-source';
import { Exchange } from '../../entity/Exchange';
import { Message } from '../../entity/Message';
import { IpcChannel } from '../../interfaces/IpcChannel';
import { messagesToPrompt } from '../../utils/messagesToPrompt';
import { messagesToText } from '../../utils/messagesToText';

export class GenerateResponseChannel implements IpcChannel {
  private openAi: OpenAI;

  getName(): string {
    return GENERATE_RESPONSE_CHANNEL;
  }

  setUpOpenAi(): void {
    // set up OpenAI connection
    this.openAi = new OpenAi({
      organization: OPENAI_ORG_ID,
      apiKey: OPENAI_API_KEY,
    });
  }

  async evaluate(exchange: Exchange, messages: Message[]): Promise<boolean> {
    log.debug(`evaluating exchange`, exchange?.id);

    if (!this.openAi) {
      this.setUpOpenAi();
    }

    // evaluate
    const triggers = exchange?.triggers || [];
    const instructions = exchange?.instructions || '';
    const assistant = exchange?.assistant;

    const evaluations: string[] = [];

    if (triggers.length === 0) {
      log.warn(`empty triggers`);
    }
    for (const trigger of triggers) {
      log.debug(`evaluating trigger`, trigger.id);
      const evaluator = trigger.evaluator;
      const criteria = trigger.criteria;
      const evaluation = await this.openAi.chat.completions.create({
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

    return completed;
  }

  async completeExchange(exchange: Exchange): Promise<void> {
    log.debug(`completing exchange`, exchange?.id);

    const exchangeRepository = AppDataSource.getRepository(Exchange);

    // mark exchange as completed
    await exchangeRepository.update(
      { id: exchange?.id },
      { completed: true, completedAt: new Date() },
    );
  }

  async generateResponse(
    exchange: Exchange,
    messages: Message[],
  ): Promise<Message> {
    const instructions = exchange.instructions;

    const assistant = exchange?.assistant;

    // debug
    log.debug(`generating response for exchange`, exchange.id);
    log.debug(`requesting completion`);
    log.debug(`assisted by:`, assistant.id);

    // transform messages to prompt format
    const prompt = messagesToPrompt(messages);

    const completion = await this.openAi.chat.completions.create({
      messages: [
        { role: 'system', content: assistant.description },
        { role: 'system', content: instructions },
        ...prompt,
      ],
      model: 'gpt-4',
    });

    // debug
    log.debug(`received completion`);

    // create new message out of prompt
    const response = new Message();
    response.content = completion.choices[0].message.content || '';
    response.exchange = exchange.id;
    response.sender = assistant;

    return response;
  }

  async handle(
    event: IpcMainEvent,
    request: IpcRequest<GenerateResponseParams>,
  ): Promise<void> {
    // debug
    log.debug(`handling ${this.getName()}...`);

    if (!this.openAi) {
      this.setUpOpenAi();
    }

    if (!request.responseChannel) {
      request.responseChannel = `${this.getName()}:response`;
    }

    // todo: handle null params
    if (!request?.params?.exchangeId) {
      return;
    }

    const { exchangeId } = request.params;

    // get repositories
    const exchangeRepository = AppDataSource.getRepository(Exchange);
    const messageRepository = AppDataSource.getRepository(Message);

    // get exchange
    const instances = await exchangeRepository.find({
      where: { id: exchangeId },
      relations: { triggers: true, interaction: true },
      take: 1,
    });
    const exchange = instances?.length ? instances[0] : null;

    // todo: handle null exchange
    if (!exchange) {
      return;
    }

    const messages = await messageRepository.findBy({
      exchange: { id: exchangeId },
    });

    const exchangeAlreadyCompleted = exchange.completed;

    // no need to evaluate if already completed, just continue the conversation
    if (exchangeAlreadyCompleted) {
      const response = await this.generateResponse(exchange, messages);

      const { id } = await messageRepository.save(response);

      const savedMessage = await messageRepository.findOneBy({ id });

      if (savedMessage) {
        // debug
        log.debug(`generated response:`, savedMessage?.id);
      }

      event.sender.send(request.responseChannel, instanceToPlain(savedMessage));
    } else {
      // evaluate
      const completed = await this.evaluate(exchange, messages);

      if (completed) {
        await this.completeExchange(exchange);
        event.sender.send(request.responseChannel, null);
      } else {
        const response = await this.generateResponse(exchange, messages);

        const { id } = await messageRepository.save(response);

        const savedMessage = await messageRepository.findOneBy({ id });

        // evaluate again, after the response has been generated
        if (savedMessage) {
          // debug
          log.debug(`generated response:`, savedMessage?.id);
          const completed = await this.evaluate(exchange, [
            ...messages,
            savedMessage,
          ]);

          if (completed) {
            await this.completeExchange(exchange);
          }
        }

        event.sender.send(
          request.responseChannel,
          instanceToPlain(savedMessage),
        );
      }
    }
  }
}
