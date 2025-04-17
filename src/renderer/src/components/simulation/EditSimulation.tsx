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
  editSimulation,
  fetchSimulation,
  selectSimulationById,
} from './SimulationsSlice';

export default function EditSimulation(): ReactElement {
  const { simulationId } = useParams();
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  if (!simulationId) {
    return <div>{t('Invalid Simulation ID')}</div>;
  }

  const simulation = useSelector((state) =>
    selectSimulationById(state, simulationId),
  );

  const [name, setName] = useState(simulation?.name || '');
  const [description, setDescription] = useState(simulation?.description || '');

  useEffect(() => {
    dispatch(fetchSimulation({ id: simulationId }));
  }, [simulationId]);

  useEffect(() => {
    if (simulation) {
      setName(simulation.name);
      setDescription(simulation.description);
    }
  }, [simulation]);

  const handleChangeName = (event: ChangeEvent<HTMLInputElement>): void => {
    setName(event.target.value);
  };

  const handleChangeDescription = (
    event: ChangeEvent<HTMLTextAreaElement>,
  ): void => {
    setDescription(event.target.value);
  };

  const handleEditSimulation = async (): Promise<void> => {
    if (!name?.trim()) {
      log.error('Name is required');
      return;
    }
    try {
      await dispatch(editSimulation({ id: simulationId, name, description }));
      navigate(`/simulations/${simulationId}`);
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
      <Typography level="h2">{t('Edit Simulation')}</Typography>

      <FormControl>
        <FormLabel>{t('ID')}</FormLabel>
        <Input value={simulationId} disabled />
      </FormControl>

      <FormControl>
        <FormLabel>{t('Name')}</FormLabel>
        <Input value={name} onChange={handleChangeName} />
        <FormHelperText>{t('This is the simulation name.')}</FormHelperText>
      </FormControl>

      <FormControl>
        <FormLabel>{t('Description')}</FormLabel>
        <Textarea value={description} onChange={handleChangeDescription} />
        <FormHelperText>
          {t('This is the simulation description.')}
        </FormHelperText>
      </FormControl>

      <Button onClick={handleEditSimulation}>{t('Save')}</Button>
    </>
  );
}
