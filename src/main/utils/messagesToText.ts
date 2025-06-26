import log from 'electron-log/main';

import { Message } from '../entity/Message';
import isAssistant from './isAssistant';

export const messagesToText = (messages: Message[]): string => {
  let text = '';

  messages.forEach((message) => {
    const sender = message.sender;

    if (!sender || typeof sender === 'string' || !('type' in sender)) {
      log.warn('Skipping message with invalid sender:', sender);
      return;
    }

    const role = isAssistant(sender.type) ? 'Assistant' : 'Participant';
    text += `${role}: ${message.content}\n\n`;
  });

  return text;
};
