import { ChangeEvent, ReactElement, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Button, FormControl, FormHelperText, FormLabel } from '@mui/joy';
import Input from '@mui/joy/Input';
import Option from '@mui/joy/Option';
import Select from '@mui/joy/Select';
import Textarea from '@mui/joy/Textarea';

import log from 'electron-log/renderer';

import { saveNewAgent } from './AgentsSlice';

const NewAgent = (): ReactElement => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [type, setType] = useState('bot');
  const [description, setDescription] = useState('');

  const handleNewAgent = async (): Promise<void> => {
    const { payload } = await dispatch(
      saveNewAgent({
        description,
        name,
        type,
      }),
    );
    log.debug(`saveNewAgent response.payload:`, payload);
    if (payload.id) {
      navigate(`/agents/${payload.id}`);
    }
  };

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

  const handleChangeType = (event: ChangeEvent<HTMLInputElement>): void => {
    const value = event.target.value;
    setType(value);
  };

  return (
    <>
      <FormControl>
        <FormControl>
          <FormLabel>Name</FormLabel>
          <Input value={name} onChange={handleChangeName} />
          <FormHelperText>{`This is the agent's name.`}</FormHelperText>
        </FormControl>
        <FormLabel>Description</FormLabel>
        <Textarea value={description} onChange={handleChangeDescription} />
        <FormHelperText>
          {`This is this agent's description, which will be sent to the language
          model.`}
        </FormHelperText>
        <Select value={type} label="Type" onChange={handleChangeType}>
          <Option value="bot">Bot</Option>
          <Option value="user">User</Option>
        </Select>
      </FormControl>
      <Button onClick={handleNewAgent}>Save</Button>
    </>
  );
};

export default NewAgent;
