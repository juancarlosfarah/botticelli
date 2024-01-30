import * as React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/joy/Box';
import Sheet from '@mui/joy/Sheet';
import Stack from '@mui/joy/Stack';

import { AppDispatch } from '../../store';
import { MessageProps } from '../../types';
import AvatarWithStatus from '../Avatars/AvatarWithStatus';
import {
  fetchExchange,
  selectExchangeById,
  startExchange,
} from '../exchange/ExchangesSlice';
import MessageLoader from '../layout/MessageLoader';
import ChatBubble from './ChatBubble';
import MessageInput from './MessageInput';
import { fetchMessages, saveNewMessage, selectMessages } from './MessagesSlice';

type MessagesPaneProps = {
  exchangeId: string;
  participantId: number;
  interactionId: string;
};

export default function MessagesPane({
  exchangeId,
  interactionId,
  participantId,
}: MessagesPaneProps): React.ReactElement {
  const status = useSelector((state) => state.messages.status);

  const [textAreaValue, setTextAreaValue] = React.useState('');

  const dispatch = useDispatch<AppDispatch>();
  const messages = useSelector(selectMessages);
  const exchange = useSelector((state) =>
    selectExchangeById(state, exchangeId),
  );

  useEffect(() => {
    dispatch(fetchExchange({ id: exchangeId }));
    dispatch(fetchMessages({ exchangeId: exchangeId }));
  }, [exchangeId]);
  useEffect((): void => {
    if (exchange && !exchange.started) {
      dispatch(startExchange(exchangeId));
    }
  }, [exchange]);

  if (!exchange) {
    return <>Exchange Not Found</>;
  }

  return (
    <>
      <Sheet
        sx={{
          // height: { xs: 'calc(100dvh - var(--Header-height))', lg: '100dvh' },
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'white',
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
              const isYou = message?.sender?.id === parseInt(participantId);

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
                    // timestamp={message.updatedAt.toString()}
                    attachment={false}
                    sender={isYou ? 'You' : message?.sender}
                  />
                </Stack>
              );
            })}
            {status === 'loading' && (
              <Box sx={{ maxWidth: '60%', minWidth: 'auto' }}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  spacing={2}
                  sx={{ mb: 0.25 }}
                >
                  <MessageLoader />
                </Stack>
              </Box>
            )}
          </Stack>
        </Box>
        {!exchange.completed && (
          <MessageInput
            textAreaValue={textAreaValue}
            setTextAreaValue={setTextAreaValue}
            onSubmit={(): void => {
              dispatch(
                saveNewMessage({
                  interactionId,
                  exchangeId,
                  content: textAreaValue,
                  evaluate: true,
                  sender: participantId,
                }),
              );
            }}
          />
        )}
      </Sheet>
    </>
  );
}
