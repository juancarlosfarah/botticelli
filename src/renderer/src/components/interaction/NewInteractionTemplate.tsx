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

import {
  fetchExchangeTemplates,
  selectAllExchangeTemplates,
} from '../exchange/ExchangeTemplatesSlice';
import { saveNewInteractionTemplate } from './InteractionTemplatesSlice';

const NewInteractionTemplate = (): ReactElement => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const availableExchangeTemplates = useSelector(selectAllExchangeTemplates);

  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState('');
  const [name, setName] = useState<string>('');
  const [exchangeTemplates, setExchangeTemplates] = useState<string[]>([]);

  useEffect(() => {
    dispatch(fetchExchangeTemplates());
  }, []);

  const handleNewInteractionTemplate = async (): Promise<void> => {
    const { payload } = await dispatch(
      saveNewInteractionTemplate({
        name,
        description,
        instructions,
        exchangeTemplates,
      }),
    );
    log.debug(`saveNewInteractionTemplate response.payload:`, payload);
    navigate(`/interactions/templates/${payload.id}`);
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

  const handleChangeExchangeTemplates = (
    _: MouseEvent | KeyboardEvent | FocusEvent | null,
    value: string[],
  ): void => {
    setExchangeTemplates(value);
  };

  return (
    <>
      <FormControl>
        <FormLabel>Name</FormLabel>
        <Input value={name} onChange={handleChangeName} />
        <FormHelperText>{`This is the interaction template's name.`}</FormHelperText>
      </FormControl>
      <FormControl>
        <FormLabel>Description</FormLabel>
        <Textarea value={description} onChange={handleChangeDescription} />
        <FormHelperText>
          This is an internal descriptions for this interaction template.
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
        <FormLabel>Exchange Templates</FormLabel>
        <Select
          multiple
          value={exchangeTemplates}
          onChange={handleChangeExchangeTemplates}
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
          {availableExchangeTemplates.map((exchangeTemplate) => (
            <Option value={exchangeTemplate.id} key={exchangeTemplate.id}>
              {exchangeTemplate.name}
            </Option>
          ))}
        </Select>
      </FormControl>
      <Button onClick={handleNewInteractionTemplate}>Save</Button>
    </>
  );
};

export default NewInteractionTemplate;
