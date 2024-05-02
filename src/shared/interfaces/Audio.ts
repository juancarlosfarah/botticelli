export interface Audio {
  id: String;
  url: String;
  blob: Blob;
  transcription?: string;
  createdAt: String;
  updatedAt: String;
}

// refers to the redux handler
export type GenerateAudioTranscriptionParams = {
  exchangeId: string;
  messageId?: string;
};
