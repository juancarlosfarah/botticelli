// general settings keys
export enum GeneralSettingsKeys {
  AllowReplies = 'allowReplies',
  AllowReporting = 'allowReporting',
  MaxMessageLength = 'maxMessageLength',
}

// Chatbot Prompt Setting keys
export enum ChatbotPromptSettingsKeys {
  Prompt = 'prompt',
  Cue = 'cue',
}

// type of general settings
export type GeneralSettings = {
  [GeneralSettingsKeys.AllowReplies]: boolean;
  [GeneralSettingsKeys.AllowReporting]: boolean;
  [GeneralSettingsKeys.MaxMessageLength]: number;

  // used to allow access using settings[settingKey] syntax
  [key: string]: unknown;
};

export type ChatCompletionMessageRoles = 'system' | 'user' | 'assistant';

export type ChatCompletionMessage = {
  role: ChatCompletionMessageRoles;
  content: string;
};

export type ChatbotPromptSettings = {
  [ChatbotPromptSettingsKeys.Prompt]: ChatCompletionMessage[];
  [ChatbotPromptSettingsKeys.Cue]: string;

  // used to allow access using settings[settingKey] syntax
  [key: string]: unknown;
};
