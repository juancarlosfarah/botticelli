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

import { selectCurrentUser } from '@renderer/components/user/UsersSlice';
import { AppDispatch } from '@renderer/store';
import log from 'electron-log/renderer';

import { fetchAgents, selectParticipants } from '../agent/AgentsSlice';
import {
  fetchInteractionTemplates,
  selectInteractionTemplates,
} from '../interaction/InteractionTemplatesSlice';
import { saveNewExperiment } from './ExperimentsSlice';

const NewExperiment = (): ReactElement => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const currentUser = useSelector(selectCurrentUser);

  const availableInteractionTemplates = useSelector(selectInteractionTemplates);
  const availableParticipants = useSelector(selectParticipants);

  const [description, setDescription] = useState('');
  const [name, setName] = useState<string>('');
  const [interactionTemplates, setInteractionTemplates] = useState<string[]>(
    [],
  );
  const [participants, setParticipants] = useState<string[]>([]);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    dispatch(fetchAgents());
    dispatch(fetchInteractionTemplates());
  }, []);

  const handleNewExperiment = async (): Promise<void> => {
    if (!currentUser) {
      throw new Error('No user logged in');
    }
    try {
      const { payload } = await dispatch(
        saveNewExperiment({
          name,
          description,
          interactionTemplates,
          participants,
          email: currentUser,
        }),
      );
      log.debug(`saveNewExperiment response.payload:`, payload);
      navigate(`/experiments/${payload.id}`);
    } catch (error) {
      log.error('Failed to save experiment:', error);
      window.alert(
        'Failed to save experiment. Please check your connection or try again later.',
      );
    }
  };

  const handleChangeDescription = (
    event: ChangeEvent<HTMLTextAreaElement>,
  ): void => {
    const value = event.target.value;
    setDescription(value);
  };

  const handleChangeParticipants = (
    _: MouseEvent | KeyboardEvent | FocusEvent | null,
    newValue: string[],
  ): void => {
    setParticipants(newValue);
  };

  const handleChangeName = (event: ChangeEvent<HTMLInputElement>): void => {
    const value = event.target.value;
    setName(value);
  };

  const handleChangeInteractionTemplates = (
    _: MouseEvent | KeyboardEvent | FocusEvent | null,
    newValue: string[],
  ): void => {
    setInteractionTemplates(newValue);
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
      <Typography level="h2">{t('New Experiment')}</Typography>
      <Box
        sx={{
          display: 'flex',
          my: 1,
          gap: 1,
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'start', sm: 'center' },
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        }}
      ></Box>

      <FormControl>
        <FormLabel>{t('Name')}</FormLabel>
        <Input value={name} onChange={handleChangeName} />
        <FormHelperText>{t("This is the experiment's name.")}</FormHelperText>
      </FormControl>
      <FormControl>
        <FormLabel>Description</FormLabel>
        <Textarea value={description} onChange={handleChangeDescription} />
        <FormHelperText>
          {t('This is an internal description for this experiment.')}
        </FormHelperText>
      </FormControl>
      <FormControl>
        <FormLabel>Interactions</FormLabel>
        <Select
          multiple
          value={interactionTemplates}
          onChange={handleChangeInteractionTemplates}
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
          {availableInteractionTemplates.map((interactionTemplate) => (
            <Option value={interactionTemplate.id} key={interactionTemplate.id}>
              {interactionTemplate.name}
            </Option>
          ))}
        </Select>
      </FormControl>
      <FormControl>
        <FormLabel>Participants</FormLabel>
        <Select
          multiple
          value={participants}
          onChange={handleChangeParticipants}
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
          {availableParticipants.map((participant) => (
            <Option value={participant.id} key={participant.id}>
              {participant.name}
            </Option>
          ))}
        </Select>
      </FormControl>
      <Button onClick={handleNewExperiment}>{t('Save')}</Button>
    </>
  );
};

export default NewExperiment;
