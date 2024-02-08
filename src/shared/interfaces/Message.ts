import Agent from './Agent';

export interface Message {
  id: string;
  content: string;
  sender: Agent;
  updatedAt: string;
  createdAt: string;
}

export type GenerateResponseParams = {
  exchangeId: string;
};

export type MessageType = Message;
