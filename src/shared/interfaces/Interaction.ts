import Conversation from './Conversation';

type Trigger = {
  id: string;
  description: string;
  instructions: string;
  name: string;
  conversations: Conversation[];
};

export default Trigger;
