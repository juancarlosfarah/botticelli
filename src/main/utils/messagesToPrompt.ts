import { ChatCompletionMessageParam } from 'openai/src/resources/chat/completions';

import { Message } from '../entity/Message';

export const messagesToPrompt = (
  messages: Message[],
): ChatCompletionMessageParam[] => {
  return messages.map((message) => {
    return {
      role: message.sender.type === 'bot' ? 'assistant' : 'user',
      content: message.content,
    };
  });
};
