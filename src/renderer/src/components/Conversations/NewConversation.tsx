import { ChangeEvent, ReactElement, useState } from 'react';
import { FormControl, FormLabel, FormHelperText, Button } from '@mui/joy';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { saveNewConversation } from './ConversationsSlice';
import { saveNewMessage } from '../Messages/MessagesSlice';
import Textarea from '@mui/joy/Textarea';

const NewConversation = (): ReactElement => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState('');
  const [cue, setCue] = useState<string>('');

  const handleNewConversation = async (): Promise<void> => {
    const { payload } = await dispatch(
      saveNewConversation({
        description,
        instructions,
      }),
    );
    console.debug(`saveNewConversation response.payload:`, payload);
    if (payload.id) {
      if (cue) {
        // debugging
        console.debug(`handleNewConversation cue:`, cue);

        await dispatch(
          saveNewMessage({
            conversationId: payload.id,
            content: cue,
            requiresResponse: false,
            sender: 1,
          }),
        );
      }

      navigate(`/conversations/${payload.id}`);
    }
  };

  const handleChangeDescription = (event: ChangeEvent<HTMLTextAreaElement>): void => {
    const value = event.target.value;
    setDescription(value);
  };

  const handleChangeInstructions = (event: ChangeEvent<HTMLTextAreaElement>): void => {
    const value = event.target.value;
    setInstructions(value);
  };

  const handleChangeCue = (event: ChangeEvent<HTMLTextAreaElement>): void => {
    const value = event.target.value;
    setCue(value);
  };

  return (
    <>
      <FormControl>
        <FormLabel>Description</FormLabel>
        <Textarea value={description} onChange={handleChangeDescription} />
        <FormHelperText>This is an internal descriptions for this conversation.</FormHelperText>
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
        <FormHelperText>This is the cue that will be shown to the participant.</FormHelperText>
      </FormControl>
      <Button onClick={handleNewConversation}>Save</Button>
    </>
  );
};

export default NewConversation;
