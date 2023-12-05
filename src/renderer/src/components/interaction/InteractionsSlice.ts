import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import {
  DELETE_ONE_INTERACTION_CHANNEL,
  GET_MANY_INTERACTIONS_CHANNEL,
  GET_ONE_INTERACTION_CHANNEL,
  POST_ONE_INTERACTION_CHANNEL,
} from '@shared/channels';
import Interaction from '@shared/interfaces/Interaction';
import log from 'electron-log/renderer';

import { IpcService } from '../../services/IpcService';

const interactionsAdapter = createEntityAdapter();

const initialState = interactionsAdapter.getInitialState({
  status: 'idle',
});

// thunk functions
export const fetchInteraction = createAsyncThunk(
  'interactions/fetchInteraction',
  async (query) => {
    const response = await IpcService.send<{ interaction: any }>(
      GET_ONE_INTERACTION_CHANNEL,
      {
        params: { query },
      },
    );

    // debugging
    log.debug(response);

    return response;
  },
);

export const fetchInteractions = createAsyncThunk(
  'interactions/fetchInteractions',
  async () => {
    return await IpcService.send<{ interactions: any }>(
      GET_MANY_INTERACTIONS_CHANNEL,
    );
  },
);

export const saveNewInteraction = createAsyncThunk<
  Interaction,
  {
    name: string;
    description: string;
    instructions: string;
    conversations: string[];
  }
>(
  'interactions/saveNewInteraction',
  async ({ description, instructions, name, conversations }) => {
    const response = await IpcService.send<{ interaction: any }>(
      POST_ONE_INTERACTION_CHANNEL,
      {
        params: {
          name,
          description,
          instructions,
          conversations,
        },
      },
    );
    return response;
  },
);

export const deleteInteraction = createAsyncThunk<
  string | number,
  string | number
>('interactions/deleteInteraction', async (id) => {
  const response = await IpcService.send<{ interaction: any }>(
    DELETE_ONE_INTERACTION_CHANNEL,
    {
      params: { id },
    },
  );
  log.debug(response);
  return id;
});

const interactionsSlice = createSlice({
  name: 'interactions',
  initialState,
  reducers: {
    interactionDeleted: interactionsAdapter.removeOne,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInteractions.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchInteractions.fulfilled, (state, action) => {
        interactionsAdapter.setAll(state, action.payload);
        state.status = 'idle';
      })
      .addCase(fetchInteraction.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchInteraction.fulfilled, (state, action) => {
        interactionsAdapter.setOne(state, action.payload);
        state.status = 'idle';
      })
      .addCase(saveNewInteraction.fulfilled, (state, action) => {
        const interaction = action.payload;
        interactionsAdapter.addOne(state, interaction);
      })
      .addCase(deleteInteraction.fulfilled, interactionsAdapter.removeOne);
  },
});

export const { interactionDeleted } = interactionsSlice.actions;

export default interactionsSlice.reducer;

export const {
  selectAll: selectInteractions,
  selectById: selectInteractionById,
} = interactionsAdapter.getSelectors((state) => state.interactions);

export const selectInteractionIds = createSelector(
  // First, pass one or more "input selector" functions:
  selectInteractions,
  // Then, an "output selector" that receives all the input results as arguments
  // and returns a final result value
  (interactions) => interactions.map((interaction) => interaction.id),
);
