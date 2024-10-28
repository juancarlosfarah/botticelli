import {
  ChangeEvent,
  ReactElement,
  useEffect,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Button, FormControl, FormHelperText, FormLabel, Radio, RadioGroup } from '@mui/joy';
import Input from '@mui/joy/Input';
import Textarea from '@mui/joy/Textarea';

import { AppDispatch } from '../../store';
import { saveNewSocialCue } from './SocialCuesSlice';
import { fetchSocialCueGroups, selectSocialCueGroups } from '../socialcuegroup/SocialCueGroupSlice';

const NewSocialCue = (): ReactElement => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const socialCueGroups = useSelector(selectSocialCueGroups); 

  const [description, setDescription] = useState('');
  const [name, setName] = useState<string>('');
  const [group, setGroup] = useState<string>('');
  const [formulation, setFormulation] = useState<string>('');

  useEffect(() => {
    // Fetch the social cue groups once when the component mounts
    dispatch(fetchSocialCueGroups());
  }, [dispatch]);

  const handleNewSocialCue = async (): Promise<void> => {
    const resultAction = await dispatch(
      saveNewSocialCue({
        name,
        description,
        group,
        formulation,
      }),
    );

    if (saveNewSocialCue.fulfilled.match(resultAction)) {
      const socialCue = resultAction.payload;
      navigate(`/socialCues/${socialCue.id}`);
    }
  };

  const handleChangeDescription = (event: ChangeEvent<HTMLTextAreaElement>): void => {
    setDescription(event.target.value);
  };

  const handleChangeName = (event: ChangeEvent<HTMLInputElement>): void => {
    setName(event.target.value);
  };

  const handleChangeFormulation = (event: ChangeEvent<HTMLTextAreaElement>): void => {
    setFormulation(event.target.value);
  };

  const handleChangeGroup = (event: ChangeEvent<HTMLInputElement>): void => {
    setGroup(event.currentTarget.value);
  };

  return (
    <>
      <FormControl>
        <FormLabel>Name</FormLabel>
        <Input value={name} onChange={handleChangeName} />
        <FormHelperText>{`This is the social cue's name.`}</FormHelperText>
      </FormControl>

      <FormControl>
        <FormLabel>Description</FormLabel>
        <Textarea value={description} onChange={handleChangeDescription} />
        <FormHelperText>
          This is an internal description for this social cue.
        </FormHelperText>
      </FormControl>

      <FormControl>
        <FormLabel>Formulation</FormLabel>
        <Textarea value={formulation} onChange={handleChangeFormulation} />
        <FormHelperText>
          This is the formulation for this social cue.
        </FormHelperText>
      </FormControl>

      <FormControl>
        <FormLabel>Group</FormLabel>
        <RadioGroup
          defaultValue="none"
          name="radio-buttons-group"
          value={group}
          onChange={handleChangeGroup}
        >
          {socialCueGroups.map((cueGroup) => (
            <Radio key={cueGroup.id} value={cueGroup.id} label={cueGroup.name} />
          ))}
        </RadioGroup>
        <FormHelperText>
          Choose the most appropriate group for this social cue.
        </FormHelperText>
      </FormControl>

      <Button onClick={handleNewSocialCue}>Save</Button>
    </>
  );
};

export default NewSocialCue;
