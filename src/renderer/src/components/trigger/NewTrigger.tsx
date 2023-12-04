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

import log from 'electron-log/renderer';

import { fetchAgents, selectAssistants } from '../agent/AgentsSlice';
import { saveNewTrigger } from './TriggersSlice';

const NewTrigger = (): ReactElement => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const evaluators = useSelector(selectAssistants);

  const [description, setDescription] = useState('');
  const [criteria, setCriteria] = useState('');
  const [name, setName] = useState<string>('');
  const [evaluator, setEvaluator] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchAgents());
  }, []);

  const handleNewTrigger = async (): Promise<void> => {
    const { payload } = await dispatch(
      saveNewTrigger({
        name,
        description,
        criteria,
        evaluator,
      }),
    );
    log.debug(`saveNewTrigger response.payload:`, payload);
    navigate(`/triggers/${payload.id}`);
  };

  const handleChangeDescription = (
    event: ChangeEvent<HTMLTextAreaElement>,
  ): void => {
    const value = event.target.value;
    setDescription(value);
  };

  const handleChangeCriteria = (
    event: ChangeEvent<HTMLTextAreaElement>,
  ): void => {
    const value = event.target.value;
    setCriteria(value);
  };

  const handleChangeName = (event: ChangeEvent<HTMLInputElement>): void => {
    const value = event.target.value;
    setName(value);
  };

  const handleChangeEvaluator = (
    event: SyntheticEvent | null,
    newValue: string | null,
  ): void => {
    setEvaluator(newValue);
  };

  return (
    <>
      <FormControl>
        <FormLabel>Name</FormLabel>
        <Input value={name} onChange={handleChangeName} />
        <FormHelperText>{`This is the trigger's name.`}</FormHelperText>
      </FormControl>
      <FormControl>
        <FormLabel>Description</FormLabel>
        <Textarea value={description} onChange={handleChangeDescription} />
        <FormHelperText>
          This is an internal descriptions for this trigger.
        </FormHelperText>
      </FormControl>
      <FormControl>
        <FormLabel>Instructions</FormLabel>
        <Textarea value={criteria} onChange={handleChangeCriteria} />
        <FormHelperText>
          These are the instructions that will be sent to the language model.
        </FormHelperText>
      </FormControl>
      <FormControl>
        <FormLabel>Assistant</FormLabel>
        <Select value={evaluator} onChange={handleChangeEvaluator}>
          {evaluators.map((agent) => (
            <Option value={agent.id} key={agent.id}>
              {agent.name}
            </Option>
          ))}
        </Select>
      </FormControl>
      <Button onClick={handleNewTrigger}>Save</Button>
    </>
  );
};

export default NewTrigger;
