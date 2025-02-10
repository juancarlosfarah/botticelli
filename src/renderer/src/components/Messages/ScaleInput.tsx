import { ChangeEvent, ReactElement, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import SendRoundedIcon from '@mui/icons-material/SendRounded';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import Radio from '@mui/joy/Radio';
import RadioGroup from '@mui/joy/RadioGroup';
import Typography from '@mui/joy/Typography';

import InputType from '@shared/enums/InputType';
import { KeyPressData } from '@shared/interfaces/Event';

import { AppDispatch } from '../../store';
import { saveNewMessage } from './MessagesSlice';

export type ScaleInputProps = {
  exchangeId: string;
  interactionId: string;
  participantId: string;
  completed: boolean;
  inputType: InputType;
};

export default function ScaleInput({
  exchangeId,
  participantId,
  interactionId,
  inputType,
}: ScaleInputProps): ReactElement {
  const [value, setValue] = useState<string | null>(null);
  const [keypressData, setKeypressData] = useState<KeyPressData[]>([]);

  const { t } = useTranslation();

  const dispatch = useDispatch<AppDispatch>();

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const value = event.target.value;
    setKeypressData([
      ...keypressData,
      {
        timestamp: event.timeStamp,
        key: value,
      },
    ]);
    setValue(value);
  };

  const handleSubmit = (): void => {
    if (value !== null) {
      dispatch(
        saveNewMessage({
          interactionId,
          exchangeId,
          inputType,
          keyPressEvents: keypressData,
          content: value.toString(),
          evaluate: false,
          sender: participantId,
        }),
      );
      setValue(null);
    }
  };

  return (
    <Box sx={{ px: 2, pb: 3 }}>
      <Box sx={{ border: 2, borderColor: 'divider', borderRadius: 'md', p: 1 }}>
        <FormControl>
          <RadioGroup
            sx={{
              gap: 2,
              flexWrap: 'wrap',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            name="likert"
            value={value}
            onChange={handleChange}
          >
            <Typography level="h4">{t('Not At All')}</Typography>
            {/*todo: make dynamic*/}
            {[1, 2, 3, 4, 5, 6, 7].map((val) => (
              <Radio
                key={val}
                value={val.toString()}
                label={val.toString()}
                sx={{
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              />
            ))}
            <Typography level="h4">{t('Very Strongly')}</Typography>
          </RadioGroup>
        </FormControl>
        <Box
          mt={2}
          sx={{ borderTop: 1, borderColor: 'divider' }}
          display="flex"
          justifyContent="end"
        >
          <Button
            size="sm"
            color="primary"
            sx={{
              mt: 1,
              ml: 1,
              alignSelf: 'center',
              borderRadius: 'sm',
            }}
            endDecorator={<SendRoundedIcon />}
            onClick={handleSubmit}
            disabled={value === null}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
