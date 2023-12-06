import Agent from './Agent';
import ExchangeTemplate from './ExchangeTemplate';
import Interaction from './Interaction';
import { Message } from './Message';
import Trigger from './Trigger';

type Exchange = {
  id: number;
  name: string;
  description: string;
  instructions: string;
  cue: string;
  messages: Message[];
  assistant: Agent;
  interaction: Interaction;
  triggers: Trigger[];
  template: ExchangeTemplate;
};

export default Exchange;
