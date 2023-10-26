export interface Message {
  content: string;
  id: number;
  user: {
    id: number;
    type: string;
  };
  updatedAt: string;
  createdAt: string;
}

export type MessageType = Message;
