import Conversation from './Conversation';

type Interaction = {
  id: string;
  description: string;
  instructions: string;
  name: string;
  conversations: Conversation[];
};

export default Interaction;
