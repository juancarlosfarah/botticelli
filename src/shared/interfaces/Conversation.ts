import { Message } from './Message';

type Conversation = {
  id: number;
  description: string;
  instructions: string;
  messages: Message[];
};

export default Conversation;
