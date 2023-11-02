import { IpcMainEvent } from 'electron';
import { IpcChannel } from '../../interfaces/IpcChannel';
import { GET_CONVERSATION_CHANNEL } from '../../../shared/channels';
import { IpcRequest } from '../../../shared/interfaces/IpcRequest';
import { Conversation } from '../../entity/Conversation';
import { instanceToPlain } from 'class-transformer';
import { AppDataSource } from '../../data-source';
import log from 'electron-log/main';

export class GetConversationChannel implements IpcChannel {
  getName(): string {
    return GET_CONVERSATION_CHANNEL;
  }

  async handle(event: IpcMainEvent, request: IpcRequest): Promise<void> {
    if (!request.responseChannel) {
      request.responseChannel = `${this.getName()}:response`;
    }

    const { query } = request.params;

    // debugging
    log.debug(`handling get conversation with query:`, query);

    const conversationRepository = AppDataSource.getRepository(Conversation);
    const conversation = await conversationRepository.findOneBy(query);

    // debugging
    log.debug(`got conversation:`, conversation);

    event.sender.send(request.responseChannel, instanceToPlain(conversation));
  }
}
