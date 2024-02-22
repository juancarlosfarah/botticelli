import Agent from './Agent';

export interface Message {
  id: string;
  content: string;
  sender: Agent;
  updatedAt: string;
  createdAt: string;
}

// refers to the redux handler
export type GenerateResponseParams = {
  exchangeId: string;
  interactionId: string;
};

// refers to the electron handler
export type GenerateResponseHandlerParams = {
  exchangeId: string;
};

export type GenerateResponseResponse = Message;

export type MessageType = Message;
