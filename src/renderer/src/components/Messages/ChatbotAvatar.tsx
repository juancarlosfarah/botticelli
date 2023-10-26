import { FC } from 'react';

import { SmartToy as BotIcon } from '@mui/icons-material';
import { Avatar } from '@mui/joy';

const ChatbotAvatar: FC = () => (
  <Avatar>
    <BotIcon htmlColor="#fff" />
  </Avatar>
);

export default ChatbotAvatar;
