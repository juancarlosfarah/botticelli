import * as React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Alert from '@mui/joy/Alert';
import Box from '@mui/joy/Box';
import Sheet from '@mui/joy/Sheet';
import Stack from '@mui/joy/Stack';

import { AppDispatch, RootState } from '../../store';
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
import { fetchMessages, selectMessages } from './MessagesSlice';

type MessagesPaneProps = {
  exchangeId: string;
  participantId: string;
  interactionId: string;
  readOnly?: boolean;
};

export default function MessagesPane({
  exchangeId,
  interactionId,
  participantId,
  readOnly = false,
}: MessagesPaneProps): React.ReactElement {
  const status = useSelector((state: RootState) => state.messages.status);

  const dispatch = useDispatch<AppDispatch>();
  const messages = useSelector(selectMessages);
  const exchange = useSelector((state) =>
    selectExchangeById(state, exchangeId),
  );

  useEffect(() => {
    dispatch(fetchExchange({ id: exchangeId }));
    dispatch(fetchMessages({ exchangeId }));
  }, [exchangeId]);
  useEffect((): void => {
    // do not start if this is readonly
    if (!readOnly && exchange && !exchange.started) {
      dispatch(startExchange(exchangeId));
    }
  }, [exchange]);

  if (!exchange) {
    return <>Exchange Not Found</>;
  }

  const showParticipantInstructionsOnComplete =
    exchange.completed && exchange.participantInstructionsOnComplete;

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
              const isYou = message?.sender?.id === participantId;

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
            {showParticipantInstructionsOnComplete && (
              <Alert variant="soft" color="success">
                {exchange.participantInstructionsOnComplete}
              </Alert>
            )}
          </Stack>
        </Box>
        {!(readOnly || exchange.dismissed) && (
          <MessageInput
            inputType={exchange.inputType}
            participantId={participantId}
            interactionId={interactionId}
            exchangeId={exchangeId}
            completed={exchange.completed}
          />
        )}
      </Sheet>
    </>
  );
}
