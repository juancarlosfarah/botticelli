import { IpcMainEvent } from 'electron';
import { IpcChannel } from '../../interfaces/IpcChannel';
import { GENERATE_RESPONSE_CHANNEL } from '../../../shared/channels';
import { IpcRequest } from '../../../shared/interfaces/IpcRequest';
import { Message } from '../../entity/Message';
import { instanceToPlain } from 'class-transformer';
import { AppDataSource } from '../../data-source';
import OpenAi from 'openai';
import { OPENAI_API_KEY, OPENAI_ORG_ID } from '../../config/env';
import { messagesToPrompt } from '../../utils/messagesToPrompt';

export class GenerateResponseChannel implements IpcChannel {
  getName(): string {
    return GENERATE_RESPONSE_CHANNEL;
  }

  async handle(event: IpcMainEvent, request: IpcRequest): Promise<void> {
    // debug
    console.log(`handling ${this.getName()}...`);

    if (!request.responseChannel) {
      request.responseChannel = `${this.getName()}:response`;
    }

    const { conversationId } = request.params;

    // debugging
    console.log(conversationId);

    const messageRepository = AppDataSource.getRepository(Message);

    const messages = await messageRepository.findBy({ conversation: { id: conversationId } });

    // transform messages to prompt format
    const prompt = messagesToPrompt(messages);

    //
    const openAi = new OpenAi({
      organization: OPENAI_ORG_ID,
      apiKey: OPENAI_API_KEY,
    });

    const completion = await openAi.chat.completions.create({
      messages: [{ role: 'system', content: 'You are a helpful assistant.' }, ...prompt],
      model: 'gpt-3.5-turbo',
    });
    const response = new Message();
    response.content = completion.choices[0].message.content || '';
    response.conversation = conversationId;

    // todo: make dynamic
    response.sender = 1;

    const { id } = await messageRepository.save(response);

    const savedMessage = await messageRepository.findOneBy({ id });

    // debug
    console.log(savedMessage);
    event.sender.send(request.responseChannel, instanceToPlain(savedMessage));
  }
}
