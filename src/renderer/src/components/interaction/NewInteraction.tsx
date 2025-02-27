import {
  ChangeEvent,
  FocusEvent,
  KeyboardEvent,
  MouseEvent,
  ReactElement,
  useEffect,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();

  const availableExchanges = useSelector(selectAllExchanges);

  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState('');
  const [name, setName] = useState<string>('');
  const [exchanges, setExchanges] = useState<string[]>([]);

  useEffect(() => {
    dispatch(fetchExchanges());
  }, []);

  const handleNewInteraction = async (): Promise<void> => {
    const { payload } = await dispatch(
      saveNewInteraction({
        name,
        description,
        instructions,
        exchanges,
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

  const handleChangeExchanges = (
    event: MouseEvent | KeyboardEvent | FocusEvent | null,
    newValue: string[],
  ): void => {
    setExchanges(newValue);
  };

  return (
    <>
      <FormControl>
        <FormLabel>Name</FormLabel>
        <Input value={name} onChange={handleChangeName} />
        <FormHelperText>{t("This is the Interaction's name.")}</FormHelperText>
      </FormControl>
      <FormControl>
        <FormLabel>Description</FormLabel>
        <Textarea value={description} onChange={handleChangeDescription} />
        <FormHelperText>
          {t('This is an internal descriptions for this interaction.')}
        </FormHelperText>
      </FormControl>
      <FormControl>
        <FormLabel>Instructions</FormLabel>
        <Textarea value={instructions} onChange={handleChangeInstructions} />
        <FormHelperText>
          {t(
            'These are the instructions that will be sent to the language model.',
          )}
        </FormHelperText>
      </FormControl>
      <FormControl>
        <FormLabel>{t('Exchanges')}</FormLabel>
        <Select
          multiple
          value={exchanges}
          onChange={handleChangeExchanges}
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
          {availableExchanges.map((exchange) => (
            <Option value={exchange.id} key={exchange.id}>
              {exchange.name}
            </Option>
          ))}
        </Select>
      </FormControl>
      <Button onClick={handleNewInteraction}>{t('Save')}</Button>
    </>
  );
};

export default NewInteraction;
