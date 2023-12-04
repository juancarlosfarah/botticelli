import log from 'electron-log/main';

import { Message } from '../entity/Message';
import isAssistant from './isAssistant';

export const messagesToText = (messages: Message[]): string => {
  let text = '';
  messages.forEach((message) => {
    let str = '';
    if (isAssistant(message.sender.type)) {
      str = 'Assistant:';
    } else {
      str = 'Participant:';
    }
    str = `${str} ${message.content}\n\n`;
    text += str;
  });
  return text;
};
