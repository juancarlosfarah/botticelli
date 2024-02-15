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
import Input from '@mui/joy/Input';
import Option from '@mui/joy/Option';
import Select from '@mui/joy/Select';
import Textarea from '@mui/joy/Textarea';

import { AppDispatch } from '../../store';
import { fetchAgents, selectAssistants } from '../agent/AgentsSlice';
import { fetchTriggers, selectTriggers } from '../trigger/TriggersSlice';
import { saveNewExchangeTemplate } from './ExchangeTemplatesSlice';

const NewExchangeTemplate = (): ReactElement => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const assistants = useSelector(selectAssistants);
  const availableTriggers = useSelector(selectTriggers);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState('');
  const [
    participantInstructionsOnComplete,
    setParticipantInstructionsOnComplete,
  ] = useState('');
  const [cue, setCue] = useState<string>('');
  const [assistant, setAssistant] = useState<string | null>(null);
  const [triggers, setTriggers] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchAgents());
    dispatch(fetchTriggers());
  }, []);

  const handleNewExchangeTemplate = async (): Promise<void> => {
    const resultAction = await dispatch(
      saveNewExchangeTemplate({
        name,
        description,
        instructions,
        participantInstructionsOnComplete,
        assistant,
        triggers,
        cue,
      }),
    );

    // todo: handle error
    if (saveNewExchangeTemplate.fulfilled.match(resultAction)) {
      const exchangeTemplate = resultAction.payload;
      navigate(`/exchanges/templates/${exchangeTemplate.id}`);
    }
  };

  const handleChangeName = (event: ChangeEvent<HTMLInputElement>): void => {
    const name = event.target.value;
    setName(name);
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

  const handleChangeParticipantInstructionsOnComplete = (
    event: ChangeEvent<HTMLTextAreaElement>,
  ): void => {
    const value = event.target.value;
    setParticipantInstructionsOnComplete(value);
  };

  const handleChangeCue = (event: ChangeEvent<HTMLTextAreaElement>): void => {
    const value = event.target.value;
    setCue(value);
  };

  const handleChangeAssistant = (
    _: SyntheticEvent | null,
    newValue: string | null,
  ): void => {
    setAssistant(newValue);
  };

  const handleChangeTriggers = (
    _: SyntheticEvent | null,
    newValue: string | null,
  ): void => {
    setTriggers(newValue);
  };

  return (
    <>
      <FormControl>
        <FormLabel>Name</FormLabel>
        <Input value={name} onChange={handleChangeName} />
        <FormHelperText>
          This is an internal name for this exchange template.
        </FormHelperText>
      </FormControl>
      <FormControl>
        <FormLabel>Description</FormLabel>
        <Textarea value={description} onChange={handleChangeDescription} />
        <FormHelperText>
          This is an internal description for this exchange template.
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
        <FormLabel>Assistant</FormLabel>
        <Select value={assistant} onChange={handleChangeAssistant}>
          {assistants.map((agent) => (
            <Option value={agent.id} key={agent.id}>
              {agent.name}
            </Option>
          ))}
        </Select>
      </FormControl>
      <FormControl>
        <FormLabel>Trigger</FormLabel>
        <Select value={triggers} onChange={handleChangeTriggers}>
          {availableTriggers.map((trigger) => (
            <Option value={trigger.id} key={trigger.id}>
              {trigger.name}
            </Option>
          ))}
        </Select>
      </FormControl>
      <FormControl>
        <FormLabel>Instructions On Complete</FormLabel>
        <Textarea
          value={participantInstructionsOnComplete}
          onChange={handleChangeParticipantInstructionsOnComplete}
        />
        <FormHelperText>
          These are the instructions that are shown to the participant when the
          exchange has been marked as completed.
        </FormHelperText>
      </FormControl>
      <Button onClick={handleNewExchangeTemplate}>Save</Button>
    </>
  );
};

export default NewExchangeTemplate;
