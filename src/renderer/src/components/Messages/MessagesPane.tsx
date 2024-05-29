import * as React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import CheckIcon from '@mui/icons-material/CheckRounded';
import Alert from '@mui/joy/Alert';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Sheet from '@mui/joy/Sheet';
import Stack from '@mui/joy/Stack';

import robot from '../../assets/robot.png?asset';
import { AppDispatch, RootState } from '../../store';
import { MessageProps } from '../../types';
import AvatarWithStatus from '../Avatars/AvatarWithStatus';
import {
  dismissExchange,
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
  // status is an array where each entry marks a "loading" process
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

  // completed is flagged when we reached the soft limit
  const showParticipantInstructionsOnComplete =
    exchange.completed && exchange.participantInstructionsOnComplete;

  // we calculate the number of user messages to
  // calculate whether we have reached the hard limit
  const numUserMessages = messages.filter(
    (message) => message?.sender?.id === participantId,
  ).length;

  // hard complete is when we've reached the hard limit
  const hardComplete =
    exchange.completed &&
    exchange.hardLimit &&
    numUserMessages >= exchange.hardLimit;

  // the message showed upon reaching the hard limit is slightly
  // different to the one we show when the soft limit is reached
  const messageOnComplete = hardComplete
    ? 'This exchange has been marked as completed. Please click "Done".'
    : exchange.participantInstructionsOnComplete;

  const handleDismiss = (): void => {
    dispatch(dismissExchange(exchangeId));
  };

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
                  {!isYou && <AvatarWithStatus online src={robot} />}
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
            {status.length !== 0 && (
              <Box sx={{ maxWidth: '60%', minWidth: 'auto' }}>
                <Stack direction="row" spacing={2} sx={{ mb: 0.25 }}>
                  <AvatarWithStatus online src={robot} />
                  <MessageLoader />
                </Stack>
              </Box>
            )}
            {showParticipantInstructionsOnComplete && (
              <Alert
                variant="soft"
                color="success"
                endDecorator={
                  <Button
                    size="sm"
                    color="success"
                    endDecorator={<CheckIcon />}
                    sx={{ alignSelf: 'center', borderRadius: 'sm' }}
                    onClick={handleDismiss}
                    disabled={readOnly || exchange.dismissed}
                  >
                    Done
                  </Button>
                }
              >
                {messageOnComplete}
              </Alert>
            )}
          </Stack>
        </Box>
        {!(readOnly || exchange.dismissed || hardComplete) && (
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
