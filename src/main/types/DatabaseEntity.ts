import { ArtificialAssistant } from '../entity/ArtificialAssistant';
import { ArtificialParticipant } from '../entity/ArtificialParticipant';
import { Conversation } from '../entity/Conversation';
import { HumanAssistant } from '../entity/HumanAssistant';
import { HumanParticipant } from '../entity/HumanParticipant';
import { Message } from '../entity/Message';

type DatabaseEntity =
  | ArtificialAssistant
  | ArtificialParticipant
  | HumanParticipant
  | HumanAssistant
  | Conversation
  | Message;

export default DatabaseEntity;
