export interface Audio {
  id: String;
  // url: String;
  // blob: Blob;
  blobPath?: string;
  transcription?: string;
  exchangeId: string;
  /*   createdAt: String;
  updatedAt: String; */
}

// refers to the redux handler
export type PostOneAudioParams = {
  exchangeId: string;
  blob: Blob;
};

export type PostOneAudioHandlerParams = {
  exchangeId: string;
  blobBuffer: ArrayBuffer;
};

// refers to the redux handler
export type GenerateAudioTranscriptionParams = {
  exchangeId: string;
  messageId?: string;
  blobPath: string; // Path to audio blob
};

export type GenerateAudioTranscriptionHandlerParams = {
  exchangeId: string;
  audioId: string;
};
