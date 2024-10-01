import AgentType from './AgentType';

type Agent = {
  id: string;
  type: AgentType;
  description: string;
  name: string;
  avatarURL: string;
};

export default Agent;
