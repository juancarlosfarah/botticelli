import Exchange from './Exchange';

type Interaction = {
  id: string;
  description: string;
  instructions: string;
  name: string;
  conversations: Exchange[];
};

export default Interaction;
