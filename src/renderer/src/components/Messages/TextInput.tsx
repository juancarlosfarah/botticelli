import { ReactElement, useEffect, useRef, useState } from 'react';
import * as React from 'react';
import { useDispatch } from 'react-redux';

import CheckIcon from '@mui/icons-material/CheckRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { Stack } from '@mui/joy';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import Textarea from '@mui/joy/Textarea';

import InputType from '@shared/enums/InputType';
import { KeyPressData } from '@shared/interfaces/Event';

import { AppDispatch } from '../../store';
import { dismissExchange } from '../exchange/ExchangesSlice';
import { saveNewMessage } from './MessagesSlice';

export type TextInputProps = {
  exchangeId: string;
  interactionId: string;
  participantId: string;
  completed: boolean;
  inputType: InputType;
};

export default function TextInput({
  exchangeId,
  participantId,
  interactionId,
  completed,
  inputType,
}: TextInputProps): ReactElement {
  const textAreaRef = useRef<HTMLDivElement>(null);
  const [textAreaValue, setTextAreaValue] = React.useState('');
  const [keypressData, setKeypressData] = useState<KeyPressData[]>([]);

  const dispatch = useDispatch<AppDispatch>();

  const focusOnTextArea = (): void => {
    const textareaElement = textAreaRef?.current?.querySelector('textarea');
    if (textareaElement) {
      textareaElement.focus();
    }
  };

  useEffect(() => {
    focusOnTextArea();
  });

  const handleClick = (): void => {
    if (textAreaValue.trim() !== '') {
      dispatch(
        saveNewMessage({
          interactionId,
          exchangeId,
          inputType,
          keyPressEvents: keypressData,
          content: textAreaValue,
          evaluate: true,
          sender: participantId,
        }),
      );
      setTextAreaValue('');

      // focus on the text area
      focusOnTextArea();
    }
  };

  const handleDismiss = (): void => {
    dispatch(dismissExchange(exchangeId));
  };

  return (
    <Box sx={{ px: 2, pb: 3 }}>
      <FormControl>
        <Textarea
          placeholder="Type something here…"
          aria-label="Message"
          ref={textAreaRef}
          onChange={(e): void => {
            setTextAreaValue(e.target.value);
          }}
          value={textAreaValue}
          minRows={3}
          maxRows={10}
          endDecorator={
            <Stack
              direction="row"
              justifyContent="end"
              alignItems="center"
              flexGrow={1}
              sx={{
                py: 1,
                px: 1,
                borderTop: '1px solid',
                borderColor: 'divider',
              }}
            >
              {completed && (
                <Button
                  size="sm"
                  color="success"
                  endDecorator={<CheckIcon />}
                  sx={{ alignSelf: 'center', borderRadius: 'sm' }}
                  onClick={handleDismiss}
                >
                  Done
                </Button>
              )}
              <Button
                size="sm"
                color="primary"
                sx={{ ml: 1, alignSelf: 'center', borderRadius: 'sm' }}
                endDecorator={<SendRoundedIcon />}
                onClick={handleClick}
              >
                Send
              </Button>
            </Stack>
          }
          onKeyDown={(event): void => {
            setKeypressData([
              ...keypressData,
              {
                timestamp: event.timeStamp,
                key: event.key,
              },
            ]);
            if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
              handleClick();
              // reset keypress data
              setKeypressData([]);
            }
          }}
          sx={{
            '& textarea:first-of-type': {
              minHeight: 72,
            },
          }}
        />
      </FormControl>
    </Box>
  );
}
