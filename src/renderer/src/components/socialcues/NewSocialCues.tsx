import {
  ChangeEvent,
  ReactElement,
  useEffect,
  useState,
  MouseEvent,
  KeyboardEvent,
  FocusEvent,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Button, FormControl, FormHelperText, FormLabel } from '@mui/joy';
import Input from '@mui/joy/Input';
import Textarea from '@mui/joy/Textarea';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option'; 

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


  const handleSocialCueGroupChange = (event: any, newValue: string | null) => {
    if (newValue) {
      setGroup(newValue);
      const selectedGroup = socialCueGroups.find((g) => g.id === newValue);
      console.log(`Selected group: ${selectedGroup?.name} (ID: ${newValue})`);
    }
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
        <FormLabel>Social Cue Group</FormLabel>
        <Select value={group} onChange={handleSocialCueGroupChange}>
          {socialCueGroups.map((cueGroup) => (
            <Option value={cueGroup.id} key={cueGroup.id}>
              {cueGroup.name}
            </Option>
          ))}
        </Select>
      <FormHelperText>Select the most appropriate group for this social cue.</FormHelperText>
    </FormControl>

      <Button onClick={handleNewSocialCue}>Save</Button>
    </>
  );
};

export default NewSocialCue;
