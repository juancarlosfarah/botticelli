import { ChangeEvent, ReactElement, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import React from 'react';

import { Button, FormControl, FormHelperText, FormLabel, Checkbox } from '@mui/joy'; 
import { FormGroup } from '@mui/material'; // Add this import from @mui/material

import Input from '@mui/joy/Input';
import Textarea from '@mui/joy/Textarea';

import log from 'electron-log/renderer';

import { saveNewArtificialAssistant } from '../../AgentsSlice';

// Added social cues options array
const socialCuesOptions = [
  { label: 'Humour', value: 'humor' },
  { label: 'Formality', value: 'formal' },
  { label: 'Emoticons', value: 'emoticons' },
  { label: 'Small Talk', value: 'smalltalk' },
];

const NewArtificialAssistant = (): ReactElement => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [socialCues, setSocialCues] = useState<string[]>([]); 

  const handleNewAgent = async (): Promise<void> => {
    const { payload } = await dispatch(
      saveNewArtificialAssistant({
        description,
        name,
        socialCues,
      }),
    );
    log.debug(`saveNewAgent response.payload:`, payload);
    if (payload.id) {
      navigate(`/agents/artificial/assistants/${payload.id}`);
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

  const handleSocialCuesChange = (event: ChangeEvent<HTMLInputElement>): void => { 
    const { value, checked } = event.target;
    setSocialCues((prevSocialCues) =>
      checked ? [...prevSocialCues, value] : prevSocialCues.filter((cue) => cue !== value),
    );
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
        <FormLabel component="legend">Social Cues</FormLabel>

        {socialCuesOptions.map((option) => (
    <Checkbox
      key={option.value}
      sx={{mt: 1}}
      value={option.value}
      checked={socialCues.includes(option.value)}
      onChange={handleSocialCuesChange}
      label={
        <React.Fragment>
          {option.label}
        </React.Fragment>
      }
    />
  ))}
          <FormHelperText>
          {`This is this agent's social..., which will be sent to the language
          model.`}
        </FormHelperText>
      </FormControl>


      <Button onClick={handleNewAgent}>Save</Button>
    </>
  );
};

export default NewArtificialAssistant;
