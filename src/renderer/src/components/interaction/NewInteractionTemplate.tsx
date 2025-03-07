import {
  ChangeEvent,
  FocusEvent,
  KeyboardEvent,
  MouseEvent,
  ReactElement,
  useEffect,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Typography,
} from '@mui/joy';
import Box from '@mui/joy/Box';
import Chip from '@mui/joy/Chip';
import Input from '@mui/joy/Input';
import Option from '@mui/joy/Option';
import Select from '@mui/joy/Select';
import Textarea from '@mui/joy/Textarea';

import { AppDispatch } from '../../store';
import {
  fetchExchangeTemplates,
  selectAllExchangeTemplates,
} from '../exchange/ExchangeTemplatesSlice';
import { saveNewInteractionTemplate } from './InteractionTemplatesSlice';

const NewInteractionTemplate = (): ReactElement => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const availableExchangeTemplates = useSelector(selectAllExchangeTemplates);

  const [description, setDescription] = useState('');
  const [modelInstructions, setModelInstructions] = useState('');
  const [participantInstructions, setParticipantInstructions] = useState('');
  const [
    participantInstructionsOnComplete,
    setParticipantInstructionsOnComplete,
  ] = useState('');
  const [name, setName] = useState<string>('');
  const [exchangeTemplates, setExchangeTemplates] = useState<string[]>([]);

  useEffect(() => {
    dispatch(fetchExchangeTemplates());
  }, []);

  const handleNewInteractionTemplate = async (): Promise<void> => {
    const resultAction = await dispatch(
      saveNewInteractionTemplate({
        name,
        description,
        modelInstructions,
        participantInstructions,
        participantInstructionsOnComplete,
        exchangeTemplates,
      }),
    );

    // todo: handle error
    if (saveNewInteractionTemplate.fulfilled.match(resultAction)) {
      const interactionTemplate = resultAction.payload;
      navigate(`/interactions/templates/${interactionTemplate.id}`);
    }
  };

  const handleChangeDescription = (
    event: ChangeEvent<HTMLTextAreaElement>,
  ): void => {
    const value = event.target.value;
    setDescription(value);
  };

  const handleChangeModelInstructions = (
    event: ChangeEvent<HTMLTextAreaElement>,
  ): void => {
    const value = event.target.value;
    setModelInstructions(value);
  };

  const handleChangeParticipantInstructions = (
    event: ChangeEvent<HTMLTextAreaElement>,
  ): void => {
    const value = event.target.value;
    setParticipantInstructions(value);
  };

  const handleChangeParticipantInstructionsOnComplete = (
    event: ChangeEvent<HTMLTextAreaElement>,
  ): void => {
    const value = event.target.value;
    setParticipantInstructionsOnComplete(value);
  };

  const handleChangeName = (event: ChangeEvent<HTMLInputElement>): void => {
    const value = event.target.value;
    setName(value);
  };

  const handleChangeExchangeTemplates = (
    _: MouseEvent | KeyboardEvent | FocusEvent | null,
    value: string[],
  ): void => {
    setExchangeTemplates(value);
  };

  return (
    <>
      <Button
        color="neutral"
        onClick={() => navigate(-1)}
        style={{
          maxWidth: '50px',
          maxHeight: '50px',
        }}
      >
        {t('Back')}
      </Button>
      <Typography level="h2">{t('New Interaction')}</Typography>
      <FormControl>
        <FormLabel>{t('Name')}</FormLabel>
        <Input value={name} onChange={handleChangeName} />
        <FormHelperText>
          {t("This is the interaction template's name.")}
        </FormHelperText>
      </FormControl>
      <FormControl>
        <FormLabel>Description</FormLabel>
        <Textarea value={description} onChange={handleChangeDescription} />
        <FormHelperText>
          {t('This is an internal description for this interaction template.')}
        </FormHelperText>
      </FormControl>
      <FormControl>
        <FormLabel>{t('Model Instructions')}</FormLabel>
        <Textarea
          value={modelInstructions}
          onChange={handleChangeModelInstructions}
        />
        <FormHelperText>
          {t(
            'These are the instructions that will be sent to the language model.',
          )}
        </FormHelperText>
      </FormControl>
      <FormControl>
        <FormLabel>{t('Participant Instructions')}</FormLabel>
        <Textarea
          value={participantInstructions}
          onChange={handleChangeParticipantInstructions}
        />
        <FormHelperText>
          {t(
            'These are the instructions that will be shown to participants at the start of the interaction.',
          )}
        </FormHelperText>
      </FormControl>
      <FormControl>
        <FormLabel>{t('Participant Instructions On Complete')}</FormLabel>
        <Textarea
          value={participantInstructionsOnComplete}
          onChange={handleChangeParticipantInstructionsOnComplete}
        />
        <FormHelperText>
          {t(
            'These are the instructions that are shown to the participant when the interaction has been marked as completed.',
          )}
        </FormHelperText>
      </FormControl>
      <FormControl>
        <FormLabel>{t('Exchange Templates')}</FormLabel>
        <Select
          multiple
          value={exchangeTemplates}
          onChange={handleChangeExchangeTemplates}
          renderValue={(selected): ReactElement => (
            <Box sx={{ display: 'flex', gap: '0.25rem' }}>
              {selected.map((selectedOption) => (
                <Chip variant="soft" color="primary" key={selectedOption.value}>
                  {selectedOption.label}
                </Chip>
              ))}
            </Box>
          )}
          slotProps={{
            listbox: {
              sx: {
                width: '100%',
              },
            },
          }}
        >
          {availableExchangeTemplates.map((exchangeTemplate) => (
            <Option value={exchangeTemplate.id} key={exchangeTemplate.id}>
              {exchangeTemplate.name}
            </Option>
          ))}
        </Select>
      </FormControl>
      <Button onClick={handleNewInteractionTemplate}>{t('Save')}</Button>
    </>
  );
};

export default NewInteractionTemplate;
