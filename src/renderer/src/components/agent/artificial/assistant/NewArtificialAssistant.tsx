import {
  ChangeEvent,
  ReactElement,
  useEffect,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import React from 'react';

import { Button, FormControl, FormHelperText, FormLabel, Checkbox } from '@mui/joy'; 

import Input from '@mui/joy/Input';
import Textarea from '@mui/joy/Textarea';

import log from 'electron-log/renderer';

import { saveNewArtificialAssistant } from '../../AgentsSlice';
import {
  fetchSocialCues,
  selectSocialCues,
} from '../../../socialcues/SocialCuesSlice';

const NewArtificialAssistant = (): ReactElement => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchSocialCues());
  }, []);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [socialCues, setSocialCues] = useState<string[]>([]); 

  const availableSocialCues = useSelector(selectSocialCues);


  const handleNewAgent = async (): Promise<void> => {
    const { payload } = await dispatch(
      saveNewArtificialAssistant({
        description,
        name,
        avatarUrl,
        socialCues,
      }),
    );
    log.debug(`saveNewAgent response.payload:`, payload);
    if (payload.id) {
      navigate(`/agents/artificial/assistants/${payload.id}`);
    }
  };

  console.log('socialCues:', availableSocialCues);

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

  const handleAvatarUrl = (event: ChangeEvent<HTMLInputElement>): void => {
    const value = event.target.value;
    setAvatarUrl(value);
  };

  const handleSocialCuesChange = (event: ChangeEvent<HTMLInputElement>): void => { 
    const value = event.target.value;
    setSocialCues((prevSocialCues) => [...prevSocialCues, value]);
    console.log('socialCues:', socialCues);
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
        <FormControl>
          <FormLabel>Avatar Url</FormLabel>
          <Input value={avatarUrl} onChange={handleAvatarUrl} />
          <FormHelperText>{`This is the agent's Url.`}</FormHelperText>
        </FormControl>
        <FormLabel component="legend">Social Cues</FormLabel>

        {availableSocialCues.map((option) => (
    <Checkbox
      key={option.name}
      sx={{mt: 1}}
      value={option.name}
      checked={socialCues.includes(option.name)}
      onChange={handleSocialCuesChange}
      label={
        <React.Fragment>
          {option.name}
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
