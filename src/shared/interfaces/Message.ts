import InputType from '../enums/InputType';
import Agent from './Agent';
import { KeyPressData } from './Event';

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

// refers to the redux handler
export type PostOneMessageParams = {
  interactionId: string;
  exchangeId: string;
  content: string;
  sender: string;
  inputType: InputType;
  evaluate: boolean;
  keyPressEvents: KeyPressData[];
};

// refers to the electron handler
export type PostOneMessageHandlerParams = {
  exchangeId: string;
  content: string;
  sender: string;
  inputType: InputType;
};

export type GetManyMessagesParams = {
  exchangeId: string;
};

export type DeleteOneMessageParams = {
  id: string;
};

export type DeleteOneMessageHandlerParams = string;

export type DeleteOneMessageResponse = string;

export type GetManyMessagesResponse = Message[];

export type GenerateResponseResponse = Message;

export type MessageType = Message;
