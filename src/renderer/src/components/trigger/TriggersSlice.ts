import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import Trigger from '@shared/interfaces/Trigger';
import log from 'electron-log/renderer';

import {
  DELETE_ONE_TRIGGER_CHANNEL,
  GET_MANY_TRIGGERS_CHANNEL,
  GET_ONE_TRIGGER_CHANNEL,
  POST_ONE_TRIGGER_CHANNEL,
} from '../../../../shared/channels';
import Agent from '../../../../shared/interfaces/Agent';
import { IpcService } from '../../services/IpcService';

const triggersAdapter = createEntityAdapter<Trigger>();

const initialState = triggersAdapter.getInitialState({
  status: 'idle',
});

// thunk functions
export const fetchTrigger = createAsyncThunk(
  'triggers/fetchTrigger',
  async ({ email }: { email: string }) => {
    const response = await IpcService.send<{ trigger: Trigger }>(
      GET_ONE_TRIGGER_CHANNEL,
      { params: { email } },
    );

    // debugging
    log.debug(response);

    return response;
  },
);

export const fetchTriggers = createAsyncThunk(
  'triggers/fetchTriggers',
  async ({ email }: { email: string }) => {
    const response = await IpcService.send<{ triggers: Trigger[] }>(
      GET_MANY_TRIGGERS_CHANNEL,
      { params: { email } },
    );
    return response;
  },
);

export const saveNewTrigger = createAsyncThunk<
  Trigger,
  {
    name: string;
    description: string;
    criteria: string;
    evaluator: Agent;
    email: string;
  }
>(
  'triggers/saveNewTrigger',
  async ({ description, criteria, name, evaluator, email }) => {
    const response = await IpcService.send<{ trigger: Trigger }>(
      POST_ONE_TRIGGER_CHANNEL,
      {
        params: {
          name,
          description,
          criteria,
          evaluator,
          email,
        },
      },
    );
    return response;
  },
);

export const deleteTrigger = createAsyncThunk<string | number, string | number>(
  'triggers/deleteTrigger',
  async (id) => {
    const response = await IpcService.send<{ trigger: Trigger }>(
      DELETE_ONE_TRIGGER_CHANNEL,
      {
        params: { id },
      },
    );
    log.debug(response);
    return id;
  },
);

const triggersSlice = createSlice({
  name: 'triggers',
  initialState,
  reducers: {
    triggerDeleted: triggersAdapter.removeOne,
    triggersCleared: triggersAdapter.removeAll,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTriggers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTriggers.fulfilled, (state, action) => {
        const email = action.meta.arg.email;
        const filtered = action.payload.triggers.filter(
          (s) => s.email === email,
        );
        triggersAdapter.setAll(state, filtered);
        state.status = 'idle';
      })
      .addCase(saveNewTrigger.fulfilled, (state, action) => {
        const trigger = action.payload;
        triggersAdapter.upsertOne(state, trigger);
      })
      .addCase(deleteTrigger.fulfilled, triggersAdapter.removeOne);
  },
});

export const { triggerDeleted, triggersCleared } = triggersSlice.actions;

export default triggersSlice.reducer;

export const { selectAll: selectTriggers, selectById: selectTriggerById } =
  triggersAdapter.getSelectors((state) => state.triggers);

export const selectTriggerIds = createSelector(
  // First, pass one or more "input selector" functions:
  selectTriggers,
  // Then, an "output selector" that receives all the input results as arguments
  // and returns a final result value
  (triggers) => triggers.map((trigger) => trigger.id),
);
