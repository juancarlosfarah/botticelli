export interface Audio {
  id: String;
  blobPath?: string;
  transcription?: string;
  exchangeId: string;
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
  exchangeId: string;
  // messageId?: string;
  blobPath: string; // Path to audio blob
};

export type GenerateAudioTranscriptionHandlerParams = {
  exchangeId: string;
  audioId: string;
};

export type GetManyAudiosParams = {
  messageId: string;
};

export type GetManyAudiosResponse = Audio[];
