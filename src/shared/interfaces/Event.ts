import { Message } from './Message';

export type KeyPressData = {
  timestamp: number;
  key: string;
};

export type KeyPressEvent = {
  timestamp: number;
  key: string;
  message: Message;
};

export type PostManyKeyPressEventsResponse = void;
export type PostManyKeyPressEventsHandleResponse = KeyPressEvent[];

export type PostManyKeyPressEventsParams = {
  messageId: string;
  keyPressEvents: KeyPressData[];
};
