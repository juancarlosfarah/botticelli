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
  PATCH_ONE_INTERACTION_CHANNEL,
  POST_ONE_INTERACTION_CHANNEL,
} from '@shared/channels';
import { START_INTERACTION_CHANNEL } from '@shared/channels';
import { SET_CURRENT_EXCHANGE_CHANNEL } from '@shared/channels';
import Interaction from '@shared/interfaces/Interaction';
import { NewInteractionParams } from '@shared/interfaces/Interaction';
import { GetOneInteractionParams } from '@shared/interfaces/Interaction';
import { SetCurrentExchangeParams } from '@shared/interfaces/Interaction';
import log from 'electron-log/renderer';

import { IpcService } from '../../services/IpcService';

const interactionsAdapter = createEntityAdapter<Interaction>();

const initialState = interactionsAdapter.getInitialState({
  status: 'idle',
});

// thunk functions
export const fetchInteraction = createAsyncThunk<
  Interaction,
  GetOneInteractionParams
>(
  'interactions/fetchInteraction',
  // todo: give type to `query`
  async (query) => {
    const response = await IpcService.send<{ interaction: Interaction }>(
      GET_ONE_INTERACTION_CHANNEL,
      {
        params: { query },
      },
    );

    // debugging
    log.debug(`fetchInteraction response`);

    return response;
  },
);

export const fetchInteractions = createAsyncThunk(
  'interactions/fetchInteractions',
  async ({ email }: { email: string }) => {
    const response = await IpcService.send<
      { interactions: Interaction[] },
      { email: string }
    >(GET_MANY_INTERACTIONS_CHANNEL, {
      params: { email },
    });
    return response;
  },
);
export const saveNewInteraction = createAsyncThunk<
  Interaction,
  NewInteractionParams
>(
  'interactions/saveNewInteraction',
  async ({
    name,
    description,
    // modelInstructions,
    // participantInstructions,
    // experiment,
    // template,
    // participant,
    exchanges,
    email,
  }) => {
    const response = await IpcService.send<
      { interaction: Interaction },
      { email: string }
    >(POST_ONE_INTERACTION_CHANNEL, {
      params: {
        name,
        description,
        exchanges,
        email,
      },
    });
    return response;
  },
);

export const startInteraction = createAsyncThunk<Interaction, string>(
  'interactions/startInteraction',
  async (id) => {
    const response = await IpcService.send<{ interaction: Interaction }>(
      START_INTERACTION_CHANNEL,
      {
        params: { id },
      },
    );
    log.debug(`startInteraction response`);
    return response;
  },
);

export const setCurrentExchange = createAsyncThunk<
  Interaction,
  SetCurrentExchangeParams
>(
  'interactions/setCurrentExchange',
  async ({ currentExchangeId, interactionId }) => {
    const response = await IpcService.send<
      Interaction,
      SetCurrentExchangeParams
    >(SET_CURRENT_EXCHANGE_CHANNEL, {
      params: { currentExchangeId, interactionId },
    });
    log.debug(`setCurrentExchange response`);
    return response;
  },
);

export const deleteInteraction = createAsyncThunk<
  string | number,
  string | number
>('interactions/deleteInteraction', async (id) => {
  await IpcService.send<{ interaction: Interaction }>(
    DELETE_ONE_INTERACTION_CHANNEL,
    {
      params: { id },
    },
  );
  log.debug(`deleteInteraction response`);
  return id;
});

export const editInteraction = createAsyncThunk<
  Interaction,
  { id: string; name?: string; description?: string }
>('interactions/editInteraction', async ({ id, name, description }) => {
  const response = await IpcService.send<Interaction>(
    PATCH_ONE_INTERACTION_CHANNEL,
    {
      params: { id, name, description },
    },
  );
  return response;
});

const interactionsSlice = createSlice({
  name: 'interactions',
  initialState,
  reducers: {
    interactionDeleted: interactionsAdapter.removeOne,
    interactionsCleared: interactionsAdapter.removeAll,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInteractions.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchInteractions.fulfilled, (state, action) => {
        const email = action.meta.arg.email;
        const filtered = action.payload.interactions.filter(
          (interaction) => interaction.email === email,
        );
        interactionsAdapter.setAll(state, filtered);
        state.status = 'idle';
      })

      .addCase(fetchInteraction.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(startInteraction.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(setCurrentExchange.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(setCurrentExchange.fulfilled, (state, action) => {
        interactionsAdapter.setOne(state, action.payload);
        state.status = 'idle';
      })
      .addCase(fetchInteraction.fulfilled, (state, action) => {
        interactionsAdapter.setOne(state, action.payload);
        state.status = 'idle';
      })
      .addCase(saveNewInteraction.fulfilled, (state, action) => {
        const interaction = action.payload;
        interactionsAdapter.addOne(state, interaction);
      })
      .addCase(startInteraction.fulfilled, (state, action) => {
        interactionsAdapter.setOne(state, action.payload);
        state.status = 'idle';
      })
      .addCase(deleteInteraction.fulfilled, interactionsAdapter.removeOne)
      .addCase(editInteraction.fulfilled, (state, action) => {
        const interaction = action.payload;
        interactionsAdapter.setOne(state, interaction);
      });
  },
});

export const { interactionDeleted, interactionsCleared } =
  interactionsSlice.actions;

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
