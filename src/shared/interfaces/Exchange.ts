import Agent from './Agent';
import ExchangeTemplate from './ExchangeTemplate';
import { Message } from './Message';
import Trigger from './Trigger';

type Exchange = {
  id: number;
  name: string;
  description: string;
  instructions: string;
  messages: Message[];
  assistant: Agent;
  participant: Agent;
  triggers: Trigger[];
  template: ExchangeTemplate;
};

export default Exchange;
