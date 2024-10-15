

type SocialCue = {
  id: string;
  description: string;
  name: string;
  formulation: string;
  group: string;
  createdAt: Date;
  updatedAt: Date;
};

export type PostOneSocialCueParams = {
  description: string;
  name: string;
  formulation: string;
  group: string;
};

export type GetOneSocialCueParams = {
  id: string;
};

export type DeleteOneSocialCueParams = string;
export type PostOneSocialCueResponse = SocialCue;
export type GetOneSocialCueResponse = SocialCue;
export type GetManySocialCuesResponse = SocialCue[];
// response is a string
export type DeleteOneSocialCueResponse = string;

export default SocialCue;
