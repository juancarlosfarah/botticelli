import Agent from './Agent';
import Trigger from './Trigger';

type ExchangeTemplate = {
  id: number;
  name: string;
  description: string;
  instructions: string;
  assistant: Agent;
  triggers: Trigger[];
};

export default ExchangeTemplate;
