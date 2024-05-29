import {
  ChangeEvent,
  FocusEvent,
  KeyboardEvent,
  MouseEvent,
  ReactElement,
  SyntheticEvent,
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

import InputType from '@shared/enums/InputType';
import capitalize from 'lodash.capitalize';
import isNull from 'lodash.isnull';

import { AppDispatch } from '../../store';
import { fetchAgents, selectAssistants } from '../agent/AgentsSlice';
import { fetchTriggers, selectTriggers } from '../trigger/TriggersSlice';
import { saveNewExchangeTemplate } from './ExchangeTemplatesSlice';

const NewExchangeTemplate = (): ReactElement => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const assistants = useSelector(selectAssistants);
  const availableTriggers = useSelector(selectTriggers);
  // for string enums, Object.values outputs the right side of the value
  const inputTypes = Object.values(InputType);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState('');
  const [
    participantInstructionsOnComplete,
    setParticipantInstructionsOnComplete,
  ] = useState('');
  const [cue, setCue] = useState<string>('');
  const [assistant, setAssistant] = useState<string | null>(null);
  const [triggers, setTriggers] = useState<string[]>([]);
  const [softLimit, setSoftLimit] = useState<number>(0);
  const [hardLimit, setHardLimit] = useState<number>(0);
  const [inputType, setInputType] = useState<InputType>(InputType.Text);

  useEffect(() => {
    dispatch(fetchAgents());
    dispatch(fetchTriggers());
  }, []);

  const handleNewExchangeTemplate = async (): Promise<void> => {
    const resultAction = await dispatch(
      saveNewExchangeTemplate({
        name,
        description,
        instructions,
        participantInstructionsOnComplete,
        assistant,
        triggers,
        cue,
        inputType,
        softLimit,
        hardLimit,
      }),
    );

    // todo: handle error
    if (saveNewExchangeTemplate.fulfilled.match(resultAction)) {
      const exchangeTemplate = resultAction.payload;
      navigate(`/exchanges/templates/${exchangeTemplate.id}`);
    }
  };

  const handleChangeName = (event: ChangeEvent<HTMLInputElement>): void => {
    const name = event.target.value;
    setName(name);
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

  const handleChangeParticipantInstructionsOnComplete = (
    event: ChangeEvent<HTMLTextAreaElement>,
  ): void => {
    const value = event.target.value;
    setParticipantInstructionsOnComplete(value);
  };

  const handleChangeCue = (event: ChangeEvent<HTMLTextAreaElement>): void => {
    const value = event.target.value;
    setCue(value);
  };

  const handleChangeSoftLimit = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    const value = event.target.value;
    try {
      const intValue = parseInt(value);
      if (intValue < 0) {
        setSoftLimit(0);
      } else {
        setSoftLimit(intValue);
      }
    } catch (_) {
      setSoftLimit(0);
    }
  };

  const handleChangeHardLimit = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    const value = event.target.value;
    try {
      const intValue = parseInt(value);
      if (intValue < 0) {
        setHardLimit(0);
      } else {
        setHardLimit(intValue);
      }
    } catch (_) {
      setHardLimit(0);
    }
  };

  const handleChangeAssistant = (
    _: SyntheticEvent | null,
    newValue: string | null,
  ): void => {
    setAssistant(newValue);
  };

  const handleChangeInputType = (
    _: SyntheticEvent | null,
    newValue: InputType | null,
  ): void => {
    if (!isNull(newValue)) {
      setInputType(newValue);
    } else {
      setInputType(InputType.Text);
    }
  };

  const handleChangeTriggers = (
    _: MouseEvent | KeyboardEvent | FocusEvent | null,
    newValue: string[],
  ): void => {
    setTriggers(newValue);
  };

  return (
    <>
      <FormControl>
        <FormLabel>Name</FormLabel>
        <Input value={name} onChange={handleChangeName} />
        <FormHelperText>
          This is an internal name for this exchange template.
        </FormHelperText>
      </FormControl>

      <FormControl>
        <FormLabel>Description</FormLabel>
        <Textarea value={description} onChange={handleChangeDescription} />
        <FormHelperText>
          This is an internal description for this exchange template.
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
        <FormLabel>Cue</FormLabel>
        <Textarea value={cue} onChange={handleChangeCue} />
        <FormHelperText>
          This is the cue that will be shown to the participant.
        </FormHelperText>
      </FormControl>

      <FormControl>
        <FormLabel>Input Type</FormLabel>
        <Select value={inputType} onChange={handleChangeInputType}>
          {inputTypes.map((inputType) => (
            <Option value={inputType} key={inputType}>
              {capitalize(inputType)}
            </Option>
          ))}
        </Select>
      </FormControl>

      <FormControl>
        <FormLabel>Assistant</FormLabel>
        <Select value={assistant} onChange={handleChangeAssistant}>
          {assistants.map((agent) => (
            <Option value={agent.id} key={agent.id}>
              {agent.name}
            </Option>
          ))}
        </Select>
      </FormControl>

      <FormControl>
        <FormLabel>Instructions On Complete</FormLabel>
        <Textarea
          value={participantInstructionsOnComplete}
          onChange={handleChangeParticipantInstructionsOnComplete}
        />
        <FormHelperText>
          These are the instructions that are shown to the participant when the
          exchange has been marked as completed.
        </FormHelperText>
      </FormControl>

      <FormControl>
        <FormLabel>Triggers</FormLabel>
        <Select
          multiple
          value={triggers}
          onChange={handleChangeTriggers}
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
          {availableTriggers.map((trigger) => (
            <Option value={trigger.id} key={trigger.id}>
              {trigger.name}
            </Option>
          ))}
        </Select>
      </FormControl>

      <FormControl>
        <FormLabel>Soft Limit</FormLabel>
        <Input
          slotProps={{ input: { type: 'number', interval: 1, min: 0 } }}
          value={softLimit}
          onChange={handleChangeSoftLimit}
        />
        <FormHelperText>
          When the exchange reaches this total number of user messages, the
          exchange will be marked as completed. Participants will be able to
          continue to send messages, but they will be also able to dismiss the
          exchange. Zero means there is no limit.
        </FormHelperText>
      </FormControl>

      <FormControl>
        <FormLabel>Hard Limit</FormLabel>
        <Input
          slotProps={{ input: { type: 'number', interval: 1, min: 0 } }}
          value={hardLimit}
          onChange={handleChangeHardLimit}
        />
        <FormHelperText>
          When the exchange reaches this total number of user messages, the
          exchange will be marked as blocked. Participants will not longer be
          able to send messages. Zero means there is no limit.
        </FormHelperText>
      </FormControl>

      <Button onClick={handleNewExchangeTemplate}>Save</Button>
    </>
  );
};

export default NewExchangeTemplate;
