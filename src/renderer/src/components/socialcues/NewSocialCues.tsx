import {
  ChangeEvent,
  FocusEvent,
  KeyboardEvent,
  MouseEvent,
  ReactElement,
  useEffect,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Button, FormControl, FormHelperText, FormLabel, Radio, RadioGroup } from '@mui/joy';
import Box from '@mui/joy/Box';
import Chip from '@mui/joy/Chip';
import Input from '@mui/joy/Input';
import Option from '@mui/joy/Option';
import Select from '@mui/joy/Select';
import Textarea from '@mui/joy/Textarea';

import { AppDispatch } from '../../store';
// import {
//   fetchAgents,
//   selectArtificialParticipants,
// } from '../agent/AgentsSlice';
// import {
//   fetchInteractionTemplates,
//   selectInteractionTemplates,
// } from '../interaction/InteractionTemplatesSlice';
import { saveNewSocialCue } from './SocialCuesSlice';

const NewSocialCue = (): ReactElement => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [description, setDescription] = useState('');
  const [name, setName] = useState<string>('');
  const [type, setType] = useState<string>('');
  const [formulation, setFormulation] = useState<string>('');
  // const [participants, setParticipants] = useState<string[]>([]);

  // useEffect(() => {
  //   dispatch(fetchAgents());
  //   dispatch(fetchInteractionTemplates());
  // }, []);

  const handleNewSocialCue = async (): Promise<void> => {
    const resultAction = await dispatch(
      saveNewSocialCue({
        name,
        description,
        type,
        formulation,
        // interactionTemplates,
        // participants,
      }),
    );
    // todo: handle error
    if (saveNewSocialCue.fulfilled.match(resultAction)) {
      const socialCue = resultAction.payload;
      navigate(`/socialCues/${socialCue.id}`);
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
  const handleChangeFormulation = (
    event: ChangeEvent<HTMLTextAreaElement>,
  ): void => {
    const value = event.target.value;
    setFormulation(value);
  };
  
  const handleChangeType = (event: ChangeEvent<HTMLInputElement>): void => {
    const value = event.target.value;
    setType(value);
  };

  return (
    <>
      <FormControl>
        <FormLabel>Name</FormLabel>
        <Input value={name} onChange={handleChangeName} />
        <FormHelperText>{`This is the socialCue's name.`}</FormHelperText>
      </FormControl>

      <FormControl>
        <FormLabel>Description</FormLabel>
        <Textarea value={description} onChange={handleChangeDescription} />
        <FormHelperText>
          This is an internal descriptions for this socialCue.
        </FormHelperText>
      </FormControl>

      <FormControl>
        <FormLabel>Formulation</FormLabel>
        <Textarea value={formulation} onChange={handleChangeFormulation} />
        <FormHelperText>
          This is the formulation for this socialCue.
        </FormHelperText>
      </FormControl>

      <FormControl>
      <FormLabel>Type</FormLabel>
      <RadioGroup defaultValue="none" name="radio-buttons-group" value={type} onChange={handleChangeType}>
      <Radio
      value="humour"
      label="humour"
      />
    <Radio value="emoticons" label="emoticons" />
    <Radio value="formality" label="formality" />
  </RadioGroup>
  <FormHelperText>Choose the most appropriate type for this social cue.</FormHelperText>
</FormControl>

      {/* <FormControl>
        <FormLabel>Interactions</FormLabel>
        <Select
          multiple
          value={interactionTemplates}
          onChange={handleChangeInteractionTemplates}
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
          {availableInteractionTemplates.map((interactionTemplate) => (
            <Option value={interactionTemplate.id} key={interactionTemplate.id}>
              {interactionTemplate.name}
            </Option>
          ))}
        </Select>
      </FormControl> */}
      {/* <FormControl>
        <FormLabel>Participants</FormLabel>
        <Select
          multiple
          value={participants}
          onChange={handleChangeParticipants}
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
          {availableParticipants.map((participant) => (
            <Option value={participant.id} key={participant.id}>
              {participant.name}
            </Option>
          ))}
        </Select>
      </FormControl> */}
      <Button onClick={handleNewSocialCue}>Save</Button>
    </>
  );
};

export default NewSocialCue;
