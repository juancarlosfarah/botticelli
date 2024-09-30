import AgentType from './AgentType';

type Agent = {
  id: string;
  type: AgentType;
  description: string;
  name: string;
  socialCues: string[];
};

export default Agent;
