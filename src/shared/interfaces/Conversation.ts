import Agent from './Agent';
import { Message } from './Message';
import Trigger from './Trigger';

type Conversation = {
  id: number;
  name: string;
  description: string;
  instructions: string;
  messages: Message[];
  assistant: Agent;
  participant: Agent;
  triggers: Trigger[];
};

export default Conversation;
