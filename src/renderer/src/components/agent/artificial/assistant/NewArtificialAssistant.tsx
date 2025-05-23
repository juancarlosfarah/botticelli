import { ChangeEvent, ReactElement, useEffect, useState } from 'react';
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
import Input from '@mui/joy/Input';
import Textarea from '@mui/joy/Textarea';

import { selectCurrentUser } from '@renderer/components/user/UsersSlice';
import { AppDispatch } from '@renderer/store';
import log from 'electron-log/renderer';

import { saveNewArtificialAssistant } from '../../AgentsSlice';

const NewArtificialAssistant = (): ReactElement => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const currentUser = useSelector(selectCurrentUser);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  const handleNewAgent = async (): Promise<void> => {
    const { payload } = await dispatch(
      saveNewArtificialAssistant({
        description,
        name,
        email: currentUser,
      }),
    );
    log.debug(`saveNewAgent response.payload:`, payload);
    if (payload.id) {
      navigate(`/agents/artificial/assistants/${payload.id}`);
    }
  };

  const handleChangeDescription = (
    event: ChangeEvent<HTMLTextAreaElement>,
  ): void => {
    const value = event.target.value;
    setDescription(value);
  };

  const handleChangeName = (event: ChangeEvent<HTMLInputElement>): void => {
    const value = event.target.value;
    setName(value);
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
      <Typography level="h2">{t('New Artificial Assistant')}</Typography>
      <FormControl>
        <FormControl>
          <FormLabel>{t('Name')}</FormLabel>
          <Input value={name} onChange={handleChangeName} />
          <FormHelperText>{t("This is the agent's name.")}</FormHelperText>
        </FormControl>
        <FormLabel>Description</FormLabel>
        <Textarea value={description} onChange={handleChangeDescription} />
        <FormHelperText>
          {t(
            "This is this agent's description, which will be sent to the language model.",
          )}
        </FormHelperText>
      </FormControl>
      <Button onClick={handleNewAgent}>{t('Save')}</Button>
    </>
  );
};

export default NewArtificialAssistant;
