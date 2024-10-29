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
import Box from '@mui/joy/Box';
import Chip from '@mui/joy/Chip';
import Option from '@mui/joy/Option';
import Select from '@mui/joy/Select';
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

  const handleNewArtificialAssistant = async (): Promise<void> => {
    const { payload } = await dispatch(
      saveNewArtificialAssistant({
        description,
        name,
        avatarUrl,
        socialCues,
      })
    );
    log.debug('saveNewAgent response.payload:', payload);
    if (payload.id) {
      navigate(`/agents/artificial/assistants/${payload.id}`);
    }
  };

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [socialCues, setSocialCues] = useState<string[]>([]); 

  const availableSocialCues = useSelector(selectSocialCues);


  const handleChangeDescription = (event: ChangeEvent<HTMLTextAreaElement>): void => {
    setDescription(event.target.value);
  };

  const handleChangeName = (event: ChangeEvent<HTMLInputElement>): void => {
    setName(event.target.value);
  };

  const handleAvatarUrl = (event: ChangeEvent<HTMLInputElement>): void => {
    setAvatarUrl(event.target.value);
  };

  const handleSocialCuesChange = (
    _: MouseEvent | KeyboardEvent | FocusEvent | null,
    newValue: string[],
  ): void => {
    setSocialCues(newValue);
  };


  return (
    <>
      <FormControl>
        <FormLabel>Name</FormLabel>
        <Input value={name} onChange={handleChangeName} />
        <FormHelperText>This is the agent's name.</FormHelperText>
      </FormControl>

      <FormControl>
        <FormLabel>Description</FormLabel>
        <Textarea value={description} onChange={handleChangeDescription} />
        <FormHelperText>This is the agent's description, which will be sent to the language model.</FormHelperText>
      </FormControl>

      <FormControl>
        <FormLabel>Avatar URL</FormLabel>
        <Input value={avatarUrl} onChange={handleAvatarUrl} />
        <FormHelperText>This is the agent's URL.</FormHelperText>
      </FormControl>

      {/* <FormControl>
        <FormLabel>Social Cues</FormLabel>
        {availableSocialCues.map((option) => (
          <Checkbox
            key={option.name}
            sx={{ mt: 1 }}
            value={option.name}
            checked={socialCues.includes(option.name)}
            onChange={handleSocialCuesChange}
            label={option.name}
          />
        ))}
        <FormHelperText>This is the agent's social cues, which will be sent to the language model.</FormHelperText>
      </FormControl> */}

      <FormControl>
        <FormLabel>Social Cues</FormLabel>
        <Select
          multiple
          value={socialCues}
          onChange={handleSocialCuesChange}
          renderValue={(selected): ReactElement => (
            <Box sx={{ display: 'flex', gap: '0.25rem' }}>
              {selected.map((selectedOption) => (
                <Chip variant="soft" color="primary" key={selectedOption.value}>
                  {selectedOption.label}
                </Chip>
              ))}
            </Box>
          )}
          slotProps={{
            listbox: {
              sx: {
                width: '100%',
              },
            },
          }}
        >
          {availableSocialCues.map((socialCue) => (
            <Option value={socialCue.id} key={socialCue.id}>
              {socialCue.name}
            </Option>
          ))}
        </Select>
      </FormControl>

      <Button onClick={handleNewArtificialAssistant}>Save</Button>
    </>
  );
};

export default NewArtificialAssistant;
