import Exchange from './Exchange';
import InteractionTemplate from './InteractionTemplate';

type Interaction = {
  id: string;
  description: string;
  instructions: string;
  name: string;
  template: InteractionTemplate;
  exchanges: Exchange[];
};

export default Interaction;
