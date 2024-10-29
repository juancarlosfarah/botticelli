import AgentType from './AgentType';
import SocialCue from './SocialCue';

type Agent = {
  id: string;
  type: AgentType;
  description: string;
  name: string;
  avatarUrl: string;
  socialCues: SocialCue[];
};

export default Agent;
