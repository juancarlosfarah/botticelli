import * as React from 'react';
import { useDispatch } from 'react-redux';

import CheckIcon from '@mui/icons-material/CheckRounded';
import FormatBoldRoundedIcon from '@mui/icons-material/FormatBoldRounded';
import FormatItalicRoundedIcon from '@mui/icons-material/FormatItalicRounded';
import FormatListBulletedRoundedIcon from '@mui/icons-material/FormatListBulletedRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import StrikethroughSRoundedIcon from '@mui/icons-material/StrikethroughSRounded';
import { IconButton, Stack } from '@mui/joy';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import Textarea from '@mui/joy/Textarea';

import { AppDispatch } from '../../store';
import { dismissExchange } from '../exchange/ExchangesSlice';

export type MessageInputProps = {
  exchangeId: string;
  textAreaValue: string;
  setTextAreaValue: (value: string) => void;
  onSubmit: () => void;
  completed: boolean;
};

export default function MessageInput({
  exchangeId,
  textAreaValue,
  setTextAreaValue,
  onSubmit,
  completed,
}: MessageInputProps): React.ReactElement {
  const textAreaRef = React.useRef<HTMLDivElement>(null);

  const dispatch = useDispatch<AppDispatch>();
  const handleClick = (): void => {
    if (textAreaValue.trim() !== '') {
      onSubmit();
      setTextAreaValue('');
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
              {/*<div>*/}
              {/*  /!*<IconButton size="sm" variant="plain" color="neutral">*!/*/}
              {/*  /!*  <FormatBoldRoundedIcon />*!/*/}
              {/*  /!*</IconButton>*!/*/}
              {/*  /!*<IconButton size="sm" variant="plain" color="neutral">*!/*/}
              {/*  /!*  <FormatItalicRoundedIcon />*!/*/}
              {/*  /!*</IconButton>*!/*/}
              {/*  /!*<IconButton size="sm" variant="plain" color="neutral">*!/*/}
              {/*  /!*  <StrikethroughSRoundedIcon />*!/*/}
              {/*  /!*</IconButton>*!/*/}
              {/*  /!*<IconButton size="sm" variant="plain" color="neutral">*!/*/}
              {/*  /!*  <FormatListBulletedRoundedIcon />*!/*/}
              {/*  /!*</IconButton>*!/*/}
              {/*</div>*/}
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
            if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
              handleClick();
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
