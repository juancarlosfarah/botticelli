import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import {
  DELETE_ONE_SIMULATION_CHANNEL,
  GET_MANY_SIMULATIONS_CHANNEL,
  GET_ONE_SIMULATION_CHANNEL,
  PATCH_ONE_SIMULATION_CHANNEL,
  POST_ONE_SIMULATION_CHANNEL,
} from '@shared/channels';
import Simulation from '@shared/interfaces/Simulation';
import {
  DeleteOneSimulationParams,
  DeleteOneSimulationResponse,
  GetOneSimulationParams,
  GetOneSimulationResponse,
  PatchOneSimulationParams,
  PostOneSimulationParams,
  PostOneSimulationResponse,
} from '@shared/interfaces/Simulation';

import { IpcService } from '../../services/IpcService';
import { RootState } from '../../store';

const simulationsAdapter = createEntityAdapter<Simulation>();

const initialState = simulationsAdapter.getInitialState({
  status: 'idle',
});

// thunk functions
export const fetchSimulation = createAsyncThunk<
  GetOneSimulationResponse,
  GetOneSimulationParams
>('simulations/fetchSimulation', async ({ id }) => {
  const response = await IpcService.send<
    GetOneSimulationResponse,
    GetOneSimulationParams
  >(GET_ONE_SIMULATION_CHANNEL, {
    params: { id },
  });
  return response;
});

export const fetchSimulations = createAsyncThunk(
  'simulations/fetchSimulations',
  async ({ email }: { email: string }) => {
    const response = await IpcService.send<
      { simulations: Simulation[] },
      { email: string }
    >(
      GET_MANY_SIMULATIONS_CHANNEL,

      {
        params: { email },
      },
    );
    return response;
  },
);

export const saveNewSimulation = createAsyncThunk<
  PostOneSimulationResponse,
  PostOneSimulationParams
>(
  'simulations/saveNewSimulation',
  async ({ description, interactionTemplates, name, participants, email }) => {
    const response = await IpcService.send<Simulation, PostOneSimulationParams>(
      POST_ONE_SIMULATION_CHANNEL,
      {
        params: {
          name,
          description,
          interactionTemplates,
          participants,
          email,
        },
      },
    );
    return response;
  },
);

export const deleteSimulation = createAsyncThunk<
  DeleteOneSimulationResponse,
  DeleteOneSimulationParams
>('simulations/deleteSimulation', async (id) => {
  await IpcService.send<string, { id }>(DELETE_ONE_SIMULATION_CHANNEL, {
    params: { id },
  });
  return id;
});

export const editSimulation = createAsyncThunk<
  Simulation,
  PatchOneSimulationParams
>('simulations/editSimulation', async ({ id, name, description }) => {
  const response = await IpcService.send<Simulation>(
    PATCH_ONE_SIMULATION_CHANNEL,
    {
      params: { id, name, description },
    },
  );
  return response;
});

const simulationsSlice = createSlice({
  name: 'simulations',
  initialState,
  reducers: {
    simulationDeleted: simulationsAdapter.removeOne,
    simulationsCleared: simulationsAdapter.removeAll,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSimulations.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSimulations.fulfilled, (state, action) => {
        const email = action.meta.arg.email;
        const filtered = action.payload.simulations.filter(
          (s) => s.email === email,
        );
        simulationsAdapter.setAll(state, filtered);
        state.status = 'idle';
      })

      .addCase(fetchSimulation.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSimulation.fulfilled, (state, action) => {
        simulationsAdapter.setOne(state, action.payload);
        state.status = 'idle';
      })
      .addCase(saveNewSimulation.fulfilled, (state, action) => {
        const simulation = action.payload;
        simulationsAdapter.addOne(state, simulation);
      })
      .addCase(deleteSimulation.fulfilled, simulationsAdapter.removeOne)
      .addCase(editSimulation.fulfilled, (state, action) => {
        const simulation = action.payload;
        simulationsAdapter.setOne(state, simulation);
      });
  },
});

export const { simulationDeleted, simulationsCleared } =
  simulationsSlice.actions;

export default simulationsSlice.reducer;

export const {
  selectAll: selectSimulations,
  selectById: selectSimulationById,
} = simulationsAdapter.getSelectors((state: RootState) => state.simulations);

export const selectSimulationIds = createSelector(
  // First, pass one or more "input selector" functions:
  selectSimulations,
  // Then, an "output selector" that receives all the input results as arguments
  // and returns a final result value
  (simulations) => simulations.map((simulation) => simulation.id),
);
