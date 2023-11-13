import Agent from './Agent';
import { Message } from './Message';

type Conversation = {
  id: number;
  description: string;
  instructions: string;
  messages: Message[];
  participants: Agent[];
};

export default Conversation;
