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

import log from 'electron-log/renderer';

import { fetchAgent, selectAgentById } from '../../AgentsSlice';

const EditArtificialAssistant = (): ReactElement => {
  const { agentId } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const agent = useSelector((state) => selectAgentById(state, agentId));

  const [name, setName] = useState(agent?.name);
  const [description, setDescription] = useState(agent?.description);

  useEffect(() => {
    const query = { id: agentId };
    log.debug(`fetching agent ${agentId}`);
    dispatch(fetchAgent(query));
  }, [agentId]);

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
    // we do all the editing
    // ...

    // navigate back to the view page
    navigate(`/agents/artificial/assistants/${agentId}`);
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
