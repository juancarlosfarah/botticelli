import { ChangeEvent, ReactElement, useEffect, useState } from 'react';
import * as React from 'react';
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

import log from 'electron-log/renderer';

import { AppDispatch } from '../../../../store';
import {
  editArtificialAssistant,
  fetchAgent,
  selectAgentById,
} from '../../AgentsSlice';

const EditArtificialAssistant = (): ReactElement => {
  const { agentId } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  if (!agentId) {
    return <div>{t('Invalid Agent ID')}</div>;
  }

  const agent = useSelector((state) => selectAgentById(state, agentId));

  const [name, setName] = useState(agent?.name || '');
  const [description, setDescription] = useState(agent?.description || '');

  useEffect(() => {
    const query = { id: agentId };
    log.debug(`fetching agent ${agentId}`);
    dispatch(fetchAgent(query));
  }, [agentId]);

  // update state when agent changes
  useEffect(() => {
    if (agent) {
      setName(agent.name);
      setDescription(agent.description);
    }
  }, [agent]);

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

  const handleEditAgent = async (): Promise<void> => {
    if (!name?.trim()) {
      // You could use a state variable to show an error message in the UI
      log.error('Name is required');
      return;
    }

    try {
      const { payload, type } = await dispatch(
        editArtificialAssistant({
          id: agentId,
          description,
          name,
        }),
      );
      log.debug(type, payload);

      // navigate back to the view page
      navigate(`/agents/artificial/assistants/${agentId}`);
    } catch (error) {
      log.error(`Error editing artificial assistant: ${error}`);
      // Handle the error in the UI
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
      <Typography level="h2">{t('Edit Artificial Assistant')}</Typography>
      <FormControl>
        <FormControl>
          <FormLabel>{t('ID')}</FormLabel>
          <Input value={agentId} disabled />
        </FormControl>
        <FormControl>
          <FormLabel>{t('Name')}</FormLabel>
          <Input value={name} onChange={handleChangeName} />
          <FormHelperText>{t("This is the agent's name.")}</FormHelperText>
        </FormControl>
        <FormLabel>{t('Description')}</FormLabel>
        <Textarea value={description} onChange={handleChangeDescription} />
        <FormHelperText>
          {t(
            "This is this agent's description, which will be sent to the language model.",
          )}
        </FormHelperText>
      </FormControl>
      <Button onClick={handleEditAgent}>{t('Save')}</Button>
    </>
  );
};

export default EditArtificialAssistant;
