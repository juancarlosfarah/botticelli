import {
  ChangeEvent,
  ReactElement,
  SyntheticEvent,
  useEffect,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Button, FormControl, FormHelperText, FormLabel } from '@mui/joy';
import Option from '@mui/joy/Option';
import Select from '@mui/joy/Select';
import Textarea from '@mui/joy/Textarea';

import log from 'electron-log/renderer';

import { saveNewMessage } from '../Messages/MessagesSlice';
import { fetchAgents, selectAgents } from '../agent/AgentsSlice';
import { saveNewConversation } from './ConversationsSlice';

const NewConversation = (): ReactElement => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const agents = useSelector(selectAgents);

  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState('');
  const [cue, setCue] = useState<string>('');
  const [lead, setLead] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchAgents());
  }, []);

  const handleNewConversation = async (): Promise<void> => {
    const { payload } = await dispatch(
      saveNewConversation({
        description,
        instructions,
        lead,
      }),
    );
    log.debug(`saveNewConversation response.payload:`, payload);
    if (payload.id) {
      if (cue) {
        // debugging
        log.debug(`handleNewConversation cue:`, cue);

        await dispatch(
          saveNewMessage({
            conversationId: payload.id,
            content: cue,
            requiresResponse: false,
            sender: lead,
          }),
        );
      }

      navigate(`/conversations/${payload.id}`);
    }
  };

  const handleChangeDescription = (
    event: ChangeEvent<HTMLTextAreaElement>,
  ): void => {
    const value = event.target.value;
    setDescription(value);
  };

  const handleChangeInstructions = (
    event: ChangeEvent<HTMLTextAreaElement>,
  ): void => {
    const value = event.target.value;
    setInstructions(value);
  };

  const handleChangeCue = (event: ChangeEvent<HTMLTextAreaElement>): void => {
    const value = event.target.value;
    setCue(value);
  };

  const handleChangeLead = (
    event: SyntheticEvent | null,
    newValue: string | null,
  ): void => {
    setLead(newValue);
  };

  return (
    <>
      <FormControl>
        <FormLabel>Description</FormLabel>
        <Textarea value={description} onChange={handleChangeDescription} />
        <FormHelperText>
          This is an internal descriptions for this conversation.
        </FormHelperText>
      </FormControl>
      <FormControl>
        <FormLabel>Instructions</FormLabel>
        <Textarea value={instructions} onChange={handleChangeInstructions} />
        <FormHelperText>
          These are the instructions that will be sent to the language model.
        </FormHelperText>
      </FormControl>
      <FormControl>
        <FormLabel>Cue</FormLabel>
        <Textarea value={cue} onChange={handleChangeCue} />
        <FormHelperText>
          This is the cue that will be shown to the participant.
        </FormHelperText>
      </FormControl>
      <FormControl>
        <FormLabel>Lead</FormLabel>
        <Select value={lead} onChange={handleChangeLead}>
          {agents.map((agent) => (
            <Option value={agent.id} key={agent.id}>
              {agent.name}
            </Option>
          ))}
        </Select>
      </FormControl>
      <Button onClick={handleNewConversation}>Save</Button>
    </>
  );
};

export default NewConversation;
