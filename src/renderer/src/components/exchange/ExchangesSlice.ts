import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import {
  COMPLETE_EXCHANGE_CHANNEL,
  DELETE_ONE_EXCHANGE_CHANNEL,
  GET_MANY_EXCHANGES_CHANNEL,
  GET_ONE_EXCHANGE_CHANNEL,
  POST_ONE_EXCHANGE_CHANNEL,
  START_EXCHANGE_CHANNEL,
} from '@shared/channels';
import Agent from '@shared/interfaces/Agent';
import Exchange from '@shared/interfaces/Exchange';
import {
  ExchangeQuery,
  ExchangeResponse,
  ExchangesResponse,
} from '@shared/interfaces/Exchange';
import log from 'electron-log/renderer';

import { DISMISS_EXCHANGE_CHANNEL } from '../../../../shared/channels';
import { IpcService } from '../../services/IpcService';
import { fetchInteraction } from '../interaction/InteractionsSlice';

const exchangesAdapter = createEntityAdapter<Exchange>();

const initialState = exchangesAdapter.getInitialState({
  status: 'idle',
});

// thunk functions
export const fetchExchange = createAsyncThunk<ExchangeResponse, ExchangeQuery>(
  'exchanges/fetchExchange',
  async (query) => {
    const response = await IpcService.send<Exchange>(GET_ONE_EXCHANGE_CHANNEL, {
      params: { query },
    });
    return response;
  },
);

export const fetchExchanges = createAsyncThunk<ExchangesResponse>(
  'exchanges/fetchExchanges',
  async () => {
    return await IpcService.send<Exchange[]>(GET_MANY_EXCHANGES_CHANNEL);
  },
);

export const saveNewExchange = createAsyncThunk<
  ExchangeResponse,
  {
    name: string;
    description: string;
    instructions: string;
    cue: string;
    assistant: Agent;
    participant: Agent;
    triggers: number;
  }
>(
  'exchanges/saveNewExchange',
  async ({
    name,
    description,
    instructions,
    assistant,
    participant,
    triggers,
    cue,
  }) => {
    const response = await IpcService.send<{ exchange: Exchange }>(
      POST_ONE_EXCHANGE_CHANNEL,
      {
        params: {
          name,
          description,
          instructions,
          assistant,
          participant,
          triggers,
          cue,
        },
      },
    );
    return response;
  },
);

export const startExchange = createAsyncThunk<ExchangeResponse, string>(
  'exchanges/startExchange',
  async (id) => {
    const response = await IpcService.send<{ exchange: Exchange }>(
      START_EXCHANGE_CHANNEL,
      {
        params: { id },
      },
    );
    log.debug(`startExchange response`);
    return response;
  },
);

export const completeExchange = createAsyncThunk<ExchangeResponse, string>(
  'exchanges/completeExchange',
  async (id) => {
    const response = await IpcService.send<{ exchange: Exchange }>(
      COMPLETE_EXCHANGE_CHANNEL,
      {
        params: { id },
      },
    );
    log.debug(`completeExchange response`);
    return response;
  },
);

export const dismissExchange = createAsyncThunk<ExchangeResponse, string>(
  'exchanges/dismissExchange',
  async (id, { dispatch }) => {
    const response = await IpcService.send<Exchange>(DISMISS_EXCHANGE_CHANNEL, {
      params: { id },
    });

    dispatch(fetchInteraction({ id: response.interaction.id }));

    log.debug(`dismissExchange response`);
    return response;
  },
);

export const deleteOneExchange = createAsyncThunk<string, string>(
  'exchanges/deleteExchange',
  async (id) => {
    await IpcService.send<{ exchange: Exchange }>(DELETE_ONE_EXCHANGE_CHANNEL, {
      params: { id },
    });
    return id;
  },
);

const exchangesSlice = createSlice({
  name: 'exchanges',
  initialState,
  reducers: {
    exchangeDeleted: exchangesAdapter.removeOne,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExchanges.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchExchanges.fulfilled, (state, action) => {
        exchangesAdapter.setAll(state, action.payload);
        state.status = 'idle';
      })
      .addCase(fetchExchange.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(startExchange.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(dismissExchange.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(completeExchange.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchExchange.fulfilled, (state, action) => {
        exchangesAdapter.setOne(state, action.payload);
        state.status = 'idle';
      })
      .addCase(startExchange.fulfilled, (state, action) => {
        exchangesAdapter.setOne(state, action.payload);
        state.status = 'idle';
      })
      .addCase(dismissExchange.fulfilled, (state, action) => {
        exchangesAdapter.setOne(state, action.payload);
        state.status = 'idle';
      })
      .addCase(completeExchange.fulfilled, (state, action) => {
        exchangesAdapter.setOne(state, action.payload);
        state.status = 'idle';
      })
      .addCase(saveNewExchange.fulfilled, (state, action) => {
        exchangesAdapter.addOne(state, action.payload);
      })
      .addCase(deleteOneExchange.fulfilled, exchangesAdapter.removeOne);
  },
});

export default exchangesSlice.reducer;

export const { selectAll: selectAllExchanges, selectById: selectExchangeById } =
  exchangesAdapter.getSelectors((state) => state.exchanges);

export const selectExchangeIds = createSelector(
  // First, pass one or more "input selector" functions:
  selectAllExchanges,
  // Then, an "output selector" that receives all the input results as arguments
  // and returns a final result value
  (exchanges) => exchanges.map((exchange) => exchange.id),
);
