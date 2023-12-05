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

import { Button, FormControl, FormHelperText, FormLabel } from '@mui/joy';
import Box from '@mui/joy/Box';
import Chip from '@mui/joy/Chip';
import Input from '@mui/joy/Input';
import Option from '@mui/joy/Option';
import Select from '@mui/joy/Select';
import Textarea from '@mui/joy/Textarea';

import log from 'electron-log/renderer';

import { fetchExchanges, selectAllExchanges } from '../exchange/ExchangesSlice';
import { saveNewInteraction } from './InteractionsSlice';

const NewInteraction = (): ReactElement => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const availableConversations = useSelector(selectAllExchanges);

  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState('');
  const [name, setName] = useState<string>('');
  const [conversations, setConversations] = useState<string[]>([]);

  useEffect(() => {
    dispatch(fetchExchanges());
  }, []);

  const handleNewInteraction = async (): Promise<void> => {
    const { payload } = await dispatch(
      saveNewInteraction({
        name,
        description,
        instructions,
        conversations,
      }),
    );
    log.debug(`saveNewInteraction response.payload:`, payload);
    navigate(`/interactions/${payload.id}`);
  };

  const handleChangeDescription = (
    event: ChangeEvent<HTMLTextAreaElement>,
  ): void => {
    const value = event.target.value;
    setDescription(value);
  };

  const handleChangeInstructions = (
    event: ChangeEvent<HTMLTextAreaElement>,
  ): void => {
    const value = event.target.value;
    setInstructions(value);
  };

  const handleChangeName = (event: ChangeEvent<HTMLInputElement>): void => {
    const value = event.target.value;
    setName(value);
  };

  const handleChangeConversations = (
    event: MouseEvent | KeyboardEvent | FocusEvent | null,
    newValue: string[],
  ): void => {
    setConversations(newValue);
  };

  return (
    <>
      <FormControl>
        <FormLabel>Name</FormLabel>
        <Input value={name} onChange={handleChangeName} />
        <FormHelperText>{`This is the interaction's name.`}</FormHelperText>
      </FormControl>
      <FormControl>
        <FormLabel>Description</FormLabel>
        <Textarea value={description} onChange={handleChangeDescription} />
        <FormHelperText>
          This is an internal descriptions for this interaction.
        </FormHelperText>
      </FormControl>
      <FormControl>
        <FormLabel>Instructions</FormLabel>
        <Textarea value={instructions} onChange={handleChangeInstructions} />
        <FormHelperText>
          These are the instructions that will be sent to the language model.
        </FormHelperText>
      </FormControl>
      <FormControl>
        <FormLabel>Conversations</FormLabel>
        <Select
          multiple
          value={conversations}
          onChange={handleChangeConversations}
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
          {availableConversations.map((conversation) => (
            <Option value={conversation.id} key={conversation.id}>
              {conversation.name}
            </Option>
          ))}
        </Select>
      </FormControl>
      <Button onClick={handleNewInteraction}>Save</Button>
    </>
  );
};

export default NewInteraction;
