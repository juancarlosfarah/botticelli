import * as React from 'react';
import Box from '@mui/joy/Box';
import Sheet from '@mui/joy/Sheet';
import Stack from '@mui/joy/Stack';
import AvatarWithStatus from '../Avatars/AvatarWithStatus';
import ChatBubble from './ChatBubble';
import MessageInput from './MessageInput';
import MessagesPaneHeader from './MessagesPaneHeader';
import { ChatProps, MessageProps } from '../../types';
import { useDispatch, useSelector } from 'react-redux';
import { saveNewMessage, selectMessages } from './MessagesSlice';
import MessageLoader from '../layout/MessageLoader';

type MessagesPaneProps = {
  conversation: MessageProps[];
};

export default function MessagesPane({ conversation }: MessagesPaneProps): React.ReactElement {
  if (!conversation) {
    return 'Loading';
  }

  const status = useSelector((state) => state.messages.status);

  const [textAreaValue, setTextAreaValue] = React.useState('');

  const dispatch = useDispatch();
  const messages = useSelector(selectMessages);

  const conversationId = conversation.id;

  console.debug(messages);

  return (
    <Sheet
      sx={{
        height: { xs: 'calc(100dvh - var(--Header-height))', lg: '100dvh' },
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'background.level1',
      }}
    >
      {/*<MessagesPaneHeader sender={conversation.sender} />*/}

      <Box
        sx={{
          display: 'flex',
          flex: 1,
          minHeight: 0,
          px: 2,
          py: 3,
          overflowY: 'scroll',
          flexDirection: 'column-reverse',
        }}
      >
        <Stack spacing={2} justifyContent="flex-end">
          {messages.map((message: MessageProps, index: number) => {
            const isYou = message?.sender?.type !== 'bot';

            return (
              <Stack
                key={index}
                direction="row"
                spacing={2}
                flexDirection={isYou ? 'row-reverse' : 'row'}
              >
                {!isYou && <AvatarWithStatus online src="" />}
                <ChatBubble
                  variant={isYou ? 'sent' : 'received'}
                  content={message.content}
                  timestamp={message.updatedAt.toString()}
                  attachment={false}
                  sender="You"
                />
              </Stack>
            );
          })}
          {status === 'loading' && <MessageLoader />}
        </Stack>
      </Box>

      <MessageInput
        textAreaValue={textAreaValue}
        setTextAreaValue={setTextAreaValue}
        onSubmit={(): void => {
          dispatch(saveNewMessage({ conversationId, content: textAreaValue }));
        }}
      />
    </Sheet>
  );
}
