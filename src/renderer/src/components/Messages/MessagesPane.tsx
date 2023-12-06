import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Sheet from '@mui/joy/Sheet';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';

import { ChatProps, MessageProps } from '../../types';
import AvatarWithStatus from '../Avatars/AvatarWithStatus';
import MessageLoader from '../layout/MessageLoader';
import ChatBubble from './ChatBubble';
import MessageInput from './MessageInput';
import MessagesPaneHeader from './MessagesPaneHeader';
import { saveNewMessage, selectMessages } from './MessagesSlice';

type MessagesPaneProps = {
  exchange: MessageProps[];
};

export default function MessagesPane({
  exchange,
}: MessagesPaneProps): React.ReactElement {
  const status = useSelector((state) => state.messages.status);

  const [textAreaValue, setTextAreaValue] = React.useState('');

  const dispatch = useDispatch();
  const messages = useSelector(selectMessages);

  const conversationId = exchange.id;

  return (
    <>
      <Typography sx={{ mt: 1 }} level="title-md">
        Messages
      </Typography>
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
              const isYou = message?.sender?.id === 2;

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
                    sender={isYou ? 'You' : message?.sender}
                  />
                </Stack>
              );
            })}
            {status === 'loading' && <MessageLoader />}
          </Stack>
        </Box>
        {exchange.completed ? (
          <Button sx={{ m: 1 }}>Next</Button>
        ) : (
          <MessageInput
            textAreaValue={textAreaValue}
            setTextAreaValue={setTextAreaValue}
            onSubmit={(): void => {
              dispatch(
                saveNewMessage({
                  conversationId,
                  content: textAreaValue,
                  evaluate: true,
                }),
              );
            }}
          />
        )}
      </Sheet>
    </>
  );
}
