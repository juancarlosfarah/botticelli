import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import {
  DELETE_ONE_EXPERIMENT_CHANNEL,
  GET_MANY_EXPERIMENTS_CHANNEL,
  GET_ONE_EXPERIMENT_CHANNEL,
  POST_ONE_EXPERIMENT_CHANNEL,
} from '@shared/channels';
import Experiment from '@shared/interfaces/Experiment';

import { IpcService } from '../../services/IpcService';

const experimentsAdapter = createEntityAdapter<Experiment>();

const initialState = experimentsAdapter.getInitialState({
  status: 'idle',
});

// thunk functions
export const fetchExperiment = createAsyncThunk(
  'experiments/fetchExperiment',
  async (query) => {
    const response = await IpcService.send<{ experiment: Experiment }>(
      GET_ONE_EXPERIMENT_CHANNEL,
      {
        params: { query },
      },
    );
    return response;
  },
);

export const fetchExperiments = createAsyncThunk(
  'experiments/fetchExperiments',
  async () => {
    return await IpcService.send<{ experiments: Experiment[] }>(
      GET_MANY_EXPERIMENTS_CHANNEL,
    );
  },
);

export const saveNewExperiment = createAsyncThunk<
  Experiment,
  {
    name: string;
    description: string;
    instructions: string;
    conversations: string[];
  }
>(
  'experiments/saveNewExperiment',
  async ({ description, interactionTemplates, name, participants }) => {
    const response = await IpcService.send<{ experiment: any }>(
      POST_ONE_EXPERIMENT_CHANNEL,
      {
        params: {
          name,
          description,
          interactionTemplates,
          participants,
        },
      },
    );
    return response;
  },
);

export const deleteExperiment = createAsyncThunk<
  string | number,
  string | number
>('experiments/deleteExperiment', async (id) => {
  await IpcService.send<{ experiment: any }>(DELETE_ONE_EXPERIMENT_CHANNEL, {
    params: { id },
  });
  return id;
});

const experimentsSlice = createSlice({
  name: 'experiments',
  initialState,
  reducers: {
    experimentDeleted: experimentsAdapter.removeOne,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExperiments.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchExperiments.fulfilled, (state, action) => {
        experimentsAdapter.setAll(state, action.payload);
        state.status = 'idle';
      })
      .addCase(fetchExperiment.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchExperiment.fulfilled, (state, action) => {
        experimentsAdapter.setOne(state, action.payload);
        state.status = 'idle';
      })
      .addCase(saveNewExperiment.fulfilled, (state, action) => {
        const experiment = action.payload;
        experimentsAdapter.addOne(state, experiment);
      })
      .addCase(deleteExperiment.fulfilled, experimentsAdapter.removeOne);
  },
});

export const { experimentDeleted } = experimentsSlice.actions;

export default experimentsSlice.reducer;

export const {
  selectAll: selectExperiments,
  selectById: selectExperimentById,
} = experimentsAdapter.getSelectors((state) => state.experiments);

export const selectExperimentIds = createSelector(
  // First, pass one or more "input selector" functions:
  selectExperiments,
  // Then, an "output selector" that receives all the input results as arguments
  // and returns a final result value
  (experiments) => experiments.map((experiment) => experiment.id),
);
