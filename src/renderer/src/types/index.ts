export type UserProps = {
  name: string;
  username: string;
  avatar: string;
  online: boolean;
};

export type AgentProps = {
  id: number;
  type: 'bot' | 'user';
};

export type MessageProps = {
  id: string;
  content: string;
  timestamp: string;
  unread?: boolean;
  sender: AgentProps;
  attachment?: {
    fileName: string;
    type: string;
    size: string;
  };
};

export type ChatProps = {
  id: string;
  sender: UserProps;
  messages: MessageProps[];
};
