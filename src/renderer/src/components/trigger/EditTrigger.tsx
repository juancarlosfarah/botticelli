import { ChangeEvent, ReactElement, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Typography,
} from '@mui/joy';
import Input from '@mui/joy/Input';
import Textarea from '@mui/joy/Textarea';

import { AppDispatch } from '@renderer/store';
import log from 'electron-log/renderer';

import { editTrigger, fetchTrigger, selectTriggerById } from './TriggersSlice';

export default function EditTrigger(): ReactElement {
  const { triggerId } = useParams();
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  if (!triggerId) {
    return <div>{t('Invalid Trigger ID')}</div>;
  }

  const trigger = useSelector((state) => selectTriggerById(state, triggerId));

  const [name, setName] = useState(trigger?.name || '');
  const [description, setDescription] = useState(trigger?.description || '');

  useEffect(() => {
    dispatch(fetchTrigger({ id: triggerId }));
  }, [triggerId]);

  useEffect(() => {
    if (trigger) {
      setName(trigger.name);
      setDescription(trigger.description);
    }
  }, [trigger]);

  const handleChangeName = (event: ChangeEvent<HTMLInputElement>): void => {
    const value = event.target.value;
    setName(value);
  };

  const handleChangeDescription = (
    event: ChangeEvent<HTMLTextAreaElement>,
  ): void => {
    const value = event.target.value;
    setDescription(value);
  };

  const handleEditTrigger = async (): Promise<void> => {
    if (!name?.trim()) {
      log.error('Name is required');
      return;
    }
    try {
      await dispatch(editTrigger({ id: triggerId, name, description }));
      navigate(`/triggers/${triggerId}`);
    } catch (error) {
      log.error(error);
    }
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
      <Typography level="h2">{t('Edit Trigger')}</Typography>
      <FormControl>
        <FormLabel>{t('ID')}</FormLabel>
        <Input value={triggerId} disabled />
      </FormControl>
      <FormControl>
        <FormLabel>{t('Name')}</FormLabel>
        <Input value={name} onChange={handleChangeName} />
        <FormHelperText>{t('This is the trigger name.')}</FormHelperText>
      </FormControl>
      <FormControl>
        <FormLabel>{t('Description')}</FormLabel>
        <Textarea value={description} onChange={handleChangeDescription} />
        <FormHelperText>{t('This is the trigger description.')}</FormHelperText>
      </FormControl>
      <Button onClick={handleEditTrigger}>{t('Save')}</Button>
    </>
  );
}
