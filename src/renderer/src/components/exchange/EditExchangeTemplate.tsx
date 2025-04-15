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
  editExchangeTemplate,
  fetchExchangeTemplate,
  selectExchangeTemplateById,
} from './ExchangeTemplatesSlice';

export default function EditExchangeTemplate(): ReactElement {
  const { exchangeTemplateId } = useParams<{ exchangeTemplateId: string }>();
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const exchangeTemplate = useSelector((state) =>
    selectExchangeTemplateById(state, exchangeTemplateId),
  );

  if (!exchangeTemplate) {
    return <div>{t('Exchange Template Not Found')}</div>;
  }

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (!exchangeTemplateId) return;
    log.debug('Fetching ExchangeTemplate with id:', exchangeTemplateId);
    dispatch(fetchExchangeTemplate({ id: exchangeTemplateId }));
  }, [dispatch, exchangeTemplateId]);

  useEffect(() => {
    if (exchangeTemplate) {
      setName(exchangeTemplate.name || '');
      setDescription(exchangeTemplate.description || '');
    }
  }, [exchangeTemplate]);

  const handleChangeName = (event: ChangeEvent<HTMLInputElement>): void => {
    setName(event.target.value);
  };

  const handleChangeDescription = (
    event: ChangeEvent<HTMLTextAreaElement>,
  ): void => {
    setDescription(event.target.value);
  };

  const handleEditExchangeTemplate = async (): Promise<void> => {
    if (!name.trim()) {
      log.error('Name is required');
      return;
    }
    try {
      await dispatch(
        editExchangeTemplate({
          id: exchangeTemplateId,
          name,
          description,
        }),
      );
      navigate(`/exchanges/templates/${exchangeTemplateId}`);
    } catch (error) {
      log.error(`Error editing exchange template:`, error);
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

      <Typography level="h2">{t('Edit Exchange Template')}</Typography>

      <FormControl>
        <FormLabel>{t('ID')}</FormLabel>
        <Input value={exchangeTemplateId} disabled />
      </FormControl>

      <FormControl>
        <FormLabel>{t('Name')}</FormLabel>
        <Input value={name} onChange={handleChangeName} />
        <FormHelperText>
          {t('This is the exchange template name.')}
        </FormHelperText>
      </FormControl>

      <FormControl>
        <FormLabel>{t('Description')}</FormLabel>
        <Textarea value={description} onChange={handleChangeDescription} />
        <FormHelperText>
          {t('This is the exchange template description.')}
        </FormHelperText>
      </FormControl>

      <Button onClick={handleEditExchangeTemplate}>{t('Save')}</Button>
    </>
  );
}
