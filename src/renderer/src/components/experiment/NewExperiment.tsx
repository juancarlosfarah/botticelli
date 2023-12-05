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

import { fetchAgents, selectParticipants } from '../agent/AgentsSlice';
import {
  fetchInteractions,
  selectInteractions,
} from '../interaction/InteractionsSlice';
import { saveNewExperiment } from './ExperimentsSlice';

const NewExperiment = (): ReactElement => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const availableInteractions = useSelector(selectInteractions);
  const availableParticipants = useSelector(selectParticipants);

  const [description, setDescription] = useState('');
  const [name, setName] = useState<string>('');
  const [interactions, setInteractions] = useState<string[]>([]);
  const [participants, setParticipants] = useState<string[]>([]);

  useEffect(() => {
    dispatch(fetchAgents());
    dispatch(fetchInteractions());
  }, []);

  const handleNewExperiment = async (): Promise<void> => {
    const { payload } = await dispatch(
      saveNewExperiment({
        name,
        description,
        interactions,
        participants,
      }),
    );
    log.debug(`saveNewExperiment response.payload:`, payload);
    navigate(`/experiments/${payload.id}`);
  };

  const handleChangeDescription = (
    event: ChangeEvent<HTMLTextAreaElement>,
  ): void => {
    const value = event.target.value;
    setDescription(value);
  };

  const handleChangeParticipants = (
    _: MouseEvent | KeyboardEvent | FocusEvent | null,
    newValue: string[],
  ): void => {
    setParticipants(newValue);
  };

  const handleChangeName = (event: ChangeEvent<HTMLInputElement>): void => {
    const value = event.target.value;
    setName(value);
  };

  const handleChangeInteractions = (
    _: MouseEvent | KeyboardEvent | FocusEvent | null,
    newValue: string[],
  ): void => {
    setInteractions(newValue);
  };

  return (
    <>
      <FormControl>
        <FormLabel>Name</FormLabel>
        <Input value={name} onChange={handleChangeName} />
        <FormHelperText>{`This is the experiment's name.`}</FormHelperText>
      </FormControl>
      <FormControl>
        <FormLabel>Description</FormLabel>
        <Textarea value={description} onChange={handleChangeDescription} />
        <FormHelperText>
          This is an internal descriptions for this experiment.
        </FormHelperText>
      </FormControl>
      <FormControl>
        <FormLabel>Interactions</FormLabel>
        <Select
          multiple
          value={interactions}
          onChange={handleChangeInteractions}
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
          {availableInteractions.map((interaction) => (
            <Option value={interaction.id} key={interaction.id}>
              {interaction.name}
            </Option>
          ))}
        </Select>
      </FormControl>
      <FormControl>
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
      </FormControl>
      <Button onClick={handleNewExperiment}>Save</Button>
    </>
  );
};

export default NewExperiment;
