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
  editInteractionTemplate,
  fetchInteractionTemplate,
  selectInteractionTemplateById,
} from './InteractionTemplatesSlice';

export default function EditInteractionTemplate(): ReactElement {
  const { interactionTemplateId } = useParams();
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  if (!interactionTemplateId) {
    return <div>{t('Invalid Interaction Template ID')}</div>;
  }

  const interactionTemplate = useSelector((state) =>
    selectInteractionTemplateById(state, interactionTemplateId),
  );

  const [name, setName] = useState(interactionTemplate?.name || '');
  const [description, setDescription] = useState(
    interactionTemplate?.description || '',
  );

  useEffect(() => {
    dispatch(fetchInteractionTemplate({ id: interactionTemplateId }));
  }, [interactionTemplateId]);

  useEffect(() => {
    if (interactionTemplate) {
      setName(interactionTemplate.name);
      setDescription(interactionTemplate.description);
    }
  }, [interactionTemplate]);

  const handleChangeName = (event: ChangeEvent<HTMLInputElement>): void => {
    setName(event.target.value);
  };

  const handleChangeDescription = (
    event: ChangeEvent<HTMLTextAreaElement>,
  ): void => {
    setDescription(event.target.value);
  };

  const handleEditInteractionTemplate = async (): Promise<void> => {
    if (!name?.trim()) {
      log.error('Name is required');
      return;
    }
    try {
      await dispatch(
        editInteractionTemplate({
          id: interactionTemplateId,
          name,
          description,
        }),
      );
      navigate(`/interactions/templates/${interactionTemplateId}`);
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
      <Typography level="h2">{t('Edit Interaction Template')}</Typography>

      <FormControl>
        <FormLabel>{t('ID')}</FormLabel>
        <Input value={interactionTemplateId} disabled />
      </FormControl>

      <FormControl>
        <FormLabel>{t('Name')}</FormLabel>
        <Input value={name} onChange={handleChangeName} />
        <FormHelperText>
          {t('This is the interaction template name.')}
        </FormHelperText>
      </FormControl>

      <FormControl>
        <FormLabel>{t('Description')}</FormLabel>
        <Textarea value={description} onChange={handleChangeDescription} />
        <FormHelperText>
          {t('This is the interaction template description.')}
        </FormHelperText>
      </FormControl>

      <Button onClick={handleEditInteractionTemplate}>{t('Save')}</Button>
    </>
  );
}
