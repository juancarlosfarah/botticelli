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

import { Button, FormControl, FormHelperText, FormLabel, Input } from '@mui/joy';
import Textarea from '@mui/joy/Textarea';

import { AppDispatch } from '../../store';
import { saveNewSocialCueGroup } from './SocialCueGroupSlice';

const NewSocialCueGroup = (): ReactElement => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [description, setDescription] = useState('');
  const [name, setName] = useState<string>('');

  const handleNewSocialCueGroup = async (): Promise<void> => {
    const resultAction = await dispatch(
      saveNewSocialCueGroup({
        name,
        description,
}),
    );
    // todo: handle error
    if (saveNewSocialCueGroup.fulfilled.match(resultAction)) {
      const socialCueGroup = resultAction.payload;
      navigate(`/socialCueGroups/${socialCueGroup.id}`);
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

  return (
    <>
      <FormControl>
        <FormLabel>Name</FormLabel>
        <Input value={name} onChange={handleChangeName} />
        <FormHelperText>{`This is the socialCueGroup's name.`}</FormHelperText>
      </FormControl>

      <FormControl>
        <FormLabel>Description</FormLabel>
        <Textarea value={description} onChange={handleChangeDescription} />
        <FormHelperText>
          This is an internal descriptions for this socialCueGroup.
        </FormHelperText>
      </FormControl>

      <Button onClick={handleNewSocialCueGroup}>Save</Button>
    </>
  );
};

export default NewSocialCueGroup;
