import InputType from '@shared/enums/InputType';

import { KeyPressData } from './Event';
import { Message } from './Message';

export interface Audio {
  id: string;
  blobPath?: string;
  transcription?: string;
  exchangeId: string;
  binaryData: Buffer;
}

// refers to the redux handler
export type PostOneAudioParams = {
  exchangeId: string;
  // messageId: string;
  blob: Blob;
};

export type PostOneAudioHandlerParams = {
  exchangeId: string;
  // messageId: string;
  blobBuffer: ArrayBuffer;
};

// refers to the redux handler
export type GenerateAudioTranscriptionParams = {
  // messageId?: string;
  blobPath: string; // Path to audio blob
};

export type GenerateAudioTranscriptionHandlerParams = {
  exchangeId: string;
  audioId: string;
};

export type SendAudiosMessageParams = {
  interactionId: string;
  exchangeId: string;
  content: string;
  sender: string;
  inputType: InputType;
  evaluate: boolean;
  keyPressEvents: KeyPressData[];
  audios: Audio[];
};

export type PostManyAudiosParams = {
  message: Message;
  savedAudios: Audio[];
};
export type GetManyAudiosParams = {
  messageId: string;
};
export type GetManyAudiosResponse = Audio[];
