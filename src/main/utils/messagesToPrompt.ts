import { ChatCompletionMessageParam } from 'openai/src/resources/chat/completions';

import { Message } from '../entity/Message';
import isAssistant from './isAssistant';

export const messagesToPrompt = (
  messages: Message[],
): ChatCompletionMessageParam[] => {
  return messages.map((message) => {
    return {
      role: isAssistant(message.sender.type) ? 'assistant' : 'user',
      content: message.content,
    };
  });
};
