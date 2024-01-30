export interface Message {
  id: string;
  content: string;
  sender: {
    id: string;
    type: string;
  };
  updatedAt: string;
  createdAt: string;
}

export type MessageType = Message;
