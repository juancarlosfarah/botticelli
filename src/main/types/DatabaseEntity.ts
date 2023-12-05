import { ArtificialAssistant } from '../entity/ArtificialAssistant';
import { ArtificialParticipant } from '../entity/ArtificialParticipant';
import { Exchange } from '../entity/Exchange';
import { HumanAssistant } from '../entity/HumanAssistant';
import { HumanParticipant } from '../entity/HumanParticipant';
import { Message } from '../entity/Message';

type DatabaseEntity =
  | ArtificialAssistant
  | ArtificialParticipant
  | HumanParticipant
  | HumanAssistant
  | Exchange
  | Message;

export default DatabaseEntity;
