

type SocialCueGroup = {
  id: string;
  description: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

export type PostOneSocialCueGroupParams = {
  description: string;
  name: string;
};

export type GetOneSocialCueGroupParams = {
  id: string;
};

export type DeleteOneSocialCueGroupParams = string;

export type PostOneSocialCueGroupResponse = SocialCueGroup;
export type GetOneSocialCueGroupResponse = SocialCueGroup;
export type GetManySocialCueGroupsResponse = SocialCueGroup[];
// response is a string
export type DeleteOneSocialCueGroupResponse = string;

export default SocialCueGroup;
