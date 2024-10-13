// import Agent from './Agent';
// import Interaction from './Interaction';
// import SocialCueInteractionTemplate from './SocialCueInteractionTemplate';

type SocialCue = {
  id: string;
  description: string;
  name: string;
  forumlation: string;
  type: string;
  // participants: Agent[];
  createdAt: Date;
  updatedAt: Date;
};

export type PostOneSocialCueParams = {
  description: string;
  name: string;
  formulation: string;
  type: string;
  // ids
  // interactionTemplates: string[];
  // participants: string[];
};

export type GetOneSocialCueParams = {
  id: string;
};

export type DeleteOneSocialCueParams = string;

// responses are currently simulations
export type PostOneSocialCueResponse = SocialCue;
export type GetOneSocialCueResponse = SocialCue;
export type GetManySocialCuesResponse = SocialCue[];
// response is a string
export type DeleteOneSocialCueResponse = string;

export default SocialCue;
