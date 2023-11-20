import { GET_CONVERSATION_CHANNEL } from '../../../shared/channels';
import { Conversation } from '../../entity/Conversation';
import { GetOneChannel } from '../common/GetOneChannel';

export class GetConversationChannel extends GetOneChannel {
  constructor() {
    super({ name: GET_CONVERSATION_CHANNEL, entity: Conversation });
  }
}
