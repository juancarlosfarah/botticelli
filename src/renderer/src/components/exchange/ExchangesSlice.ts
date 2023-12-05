import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import {
  DELETE_ONE_EXCHANGE_CHANNEL,
  GET_MANY_EXCHANGES_CHANNEL,
  GET_ONE_EXCHANGE_CHANNEL,
  POST_ONE_EXCHANGE_CHANNEL,
} from '@shared/channels';
import Agent from '@shared/interfaces/Agent';
import Exchange from '@shared/interfaces/Exchange';

import { IpcService } from '../../services/IpcService';

const exchangesAdapter = createEntityAdapter();

const initialState = exchangesAdapter.getInitialState({
  status: 'idle',
});

// thunk functions
export const fetchExchange = createAsyncThunk(
  'exchanges/fetchExchange',
  async (query) => {
    const response = await IpcService.send<{ exchange: any }>(
      GET_ONE_EXCHANGE_CHANNEL,
      {
        params: { query },
      },
    );
    return response;
  },
);

export const fetchExchanges = createAsyncThunk(
  'exchanges/fetchExchanges',
  async () => {
    return await IpcService.send<{ exchanges: any }>(
      GET_MANY_EXCHANGES_CHANNEL,
    );
  },
);

export const saveNewExchange = createAsyncThunk<
  Exchange,
  {
    name: string;
    description: string;
    instructions: string;
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
  }) => {
    const response = await IpcService.send<{ exchange: any }>(
      POST_ONE_EXCHANGE_CHANNEL,
      {
        params: {
          name,
          description,
          instructions,
          assistant,
          participant,
          triggers,
        },
      },
    );
    return response;
  },
);

export const deleteOneExchange = createAsyncThunk<
  string | number,
  string | number
>('exchanges/deleteExchange', async (id) => {
  await IpcService.send<{ exchange: any }>(DELETE_ONE_EXCHANGE_CHANNEL, {
    params: { id },
  });
  return id;
});

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
      .addCase(fetchExchange.fulfilled, (state, action) => {
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
