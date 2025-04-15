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

import {
  editInteraction,
  fetchInteraction,
  selectInteractionById,
} from './InteractionsSlice';

export default function EditInteraction(): ReactElement {
  const { interactionId } = useParams();
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  if (!interactionId) {
    return <div>{t('Invalid Interaction ID')}</div>;
  }

  const interaction = useSelector((state) =>
    selectInteractionById(state, interactionId),
  );

  const [name, setName] = useState(interaction?.name || '');
  const [description, setDescription] = useState(
    interaction?.description || '',
  );

  useEffect(() => {
    dispatch(fetchInteraction({ id: interactionId }));
  }, [interactionId]);

  useEffect(() => {
    if (interaction) {
      setName(interaction.name);
      setDescription(interaction.description);
    }
  }, [interaction]);

  const handleChangeName = (event: ChangeEvent<HTMLInputElement>): void => {
    setName(event.target.value);
  };

  const handleChangeDescription = (
    event: ChangeEvent<HTMLTextAreaElement>,
  ): void => {
    setDescription(event.target.value);
  };

  const handleEditInteraction = async (): Promise<void> => {
    if (!name?.trim()) {
      log.error('Name is required');
      return;
    }
    try {
      await dispatch(editInteraction({ id: interactionId, name, description }));
      navigate(`/interactions/${interactionId}`);
    } catch (error) {
      log.error(error);
    }
  };

  return (
    <>
      <Button
        color="neutral"
        onClick={() => navigate(-1)}
        style={{ maxWidth: '50px', maxHeight: '50px' }}
      >
        {t('Back')}
      </Button>
      <Typography level="h2">{t('Edit Interaction')}</Typography>

      <FormControl>
        <FormLabel>{t('ID')}</FormLabel>
        <Input value={interactionId} disabled />
      </FormControl>

      <FormControl>
        <FormLabel>{t('Name')}</FormLabel>
        <Input value={name} onChange={handleChangeName} />
        <FormHelperText>{t('This is the interaction name.')}</FormHelperText>
      </FormControl>

      <FormControl>
        <FormLabel>{t('Description')}</FormLabel>
        <Textarea value={description} onChange={handleChangeDescription} />
        <FormHelperText>
          {t('This is the interaction description.')}
        </FormHelperText>
      </FormControl>

      <Button onClick={handleEditInteraction}>{t('Save')}</Button>
    </>
  );
}
