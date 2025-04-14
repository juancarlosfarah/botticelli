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
  editExperiment,
  fetchExperiment,
  selectExperimentById,
} from './ExperimentsSlice';

export default function EditExperiment(): ReactElement {
  const { experimentId } = useParams();
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  if (!experimentId) {
    return <div>{t('Invalid Experiment ID')}</div>;
  }

  const experiment = useSelector((state) =>
    selectExperimentById(state, experimentId),
  );

  const [name, setName] = useState(experiment?.name || '');
  const [description, setDescription] = useState(experiment?.description || '');

  useEffect(() => {
    dispatch(fetchExperiment({ id: experimentId }));
  }, [experimentId]);

  useEffect(() => {
    if (experiment) {
      setName(experiment.name);
      setDescription(experiment.description);
    }
  }, [experiment]);

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

  const handleEditExperiment = async (): Promise<void> => {
    if (!name?.trim()) {
      log.error('Name is required');
      return;
    }
    try {
      await dispatch(editExperiment({ id: experimentId, name, description }));
      navigate(`/experiments/${experimentId}`);
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
      <Typography level="h2">{t('Edit Experiment')}</Typography>
      <FormControl>
        <FormLabel>{t('ID')}</FormLabel>
        <Input value={experimentId} disabled />
      </FormControl>
      <FormControl>
        <FormLabel>{t('Name')}</FormLabel>
        <Input value={name} onChange={handleChangeName} />
        <FormHelperText>{t('This is the experiment name.')}</FormHelperText>
      </FormControl>
      <FormControl>
        <FormLabel>{t('Description')}</FormLabel>
        <Textarea value={description} onChange={handleChangeDescription} />
        <FormHelperText>
          {t('This is the experiment description.')}
        </FormHelperText>
      </FormControl>
      <Button onClick={handleEditExperiment}>{t('Save')}</Button>
    </>
  );
}
