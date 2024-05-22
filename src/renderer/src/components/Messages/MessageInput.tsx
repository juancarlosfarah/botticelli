import { ReactElement, useEffect, useRef, useState } from 'react';

import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { Stack } from '@mui/joy';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import Textarea from '@mui/joy/Textarea';

export type MessageInputProps = {
  exchangeId: string;
  textAreaValue: string;
  setTextAreaValue: (value: string) => void;
  onSubmit: (keyPressData: KeyPressData[]) => void;
  completed: boolean;
};

type KeyPressData = {
  timestamp: number;
  key: string;
};

export default function MessageInput({
  textAreaValue,
  setTextAreaValue,
  onSubmit,
}: MessageInputProps): ReactElement {
  const textAreaRef = useRef<HTMLDivElement>(null);
  const [keypressData, setKeypressData] = useState<KeyPressData[]>([]);

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
      onSubmit(keypressData);
      setTextAreaValue('');

      // focus on the text area
      focusOnTextArea();
    }
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
