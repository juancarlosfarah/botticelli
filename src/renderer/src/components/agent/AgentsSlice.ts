import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import Agent from '@shared/interfaces/ArtificialAssistant';
import log from 'electron-log/renderer';

import {
  DELETE_AGENT_CHANNEL,
  GET_AGENTS_CHANNEL,
  GET_AGENT_CHANNEL,
  POST_AGENT_CHANNEL,
  POST_ONE_ARTIFICIAL_ASSISTANT_CHANNEL,
  POST_ONE_ARTIFICIAL_PARTICIPANT_CHANNEL,
  POST_ONE_HUMAN_ASSISTANT_CHANNEL,
  POST_ONE_HUMAN_PARTICIPANT_CHANNEL,
} from '../../../../shared/channels';
import { IpcService } from '../../services/IpcService';

const agentsAdapter = createEntityAdapter();

const initialState = agentsAdapter.getInitialState({
  status: 'idle',
});

// thunk functions
export const fetchAgent = createAsyncThunk(
  'agents/fetchAgent',
  async (query) => {
    const response = await IpcService.send<{ agent: any }>(GET_AGENT_CHANNEL, {
      params: { query },
    });

    // debugging
    log.debug(response);

    return response;
  },
);

export const fetchAgents = createAsyncThunk('agents/fetchAgents', async () => {
  return await IpcService.send<{ agents: any }>(GET_AGENTS_CHANNEL);
});

export const saveNewAgent = createAsyncThunk<
  Agent,
  { description: string; instructions: string }
>('agents/saveNewAgent', async ({ description, name }) => {
  const response = await IpcService.send<{ agent: any }>(POST_AGENT_CHANNEL, {
    params: {
      description,
      name,
    },
  });
  return response;
});

export const saveNewArtificialAssistant = createAsyncThunk<
  Agent,
  { description: string; instructions: string }
>('agents/artificial/assistants/saveNew', async ({ description, name }) => {
  const response = await IpcService.send<{ agent: any }>(
    POST_ONE_ARTIFICIAL_ASSISTANT_CHANNEL,
    {
      params: {
        description,
        name,
      },
    },
  );
  return response;
});

export const saveNewArtificialParticipant = createAsyncThunk<
  Agent,
  { description: string; instructions: string }
>('agents/artificial/participant/saveNew', async ({ description, name }) => {
  const response = await IpcService.send<{ agent: any }>(
    POST_ONE_ARTIFICIAL_PARTICIPANT_CHANNEL,
    {
      params: {
        description,
        name,
      },
    },
  );
  return response;
});

export const saveNewHumanAssistant = createAsyncThunk<
  Agent,
  { description: string; instructions: string }
>('agents/human/assistants/saveNew', async ({ description, name }) => {
  const response = await IpcService.send<{ agent: any }>(
    POST_ONE_HUMAN_ASSISTANT_CHANNEL,
    {
      params: {
        description,
        name,
      },
    },
  );
  return response;
});

export const saveNewHumanParticipant = createAsyncThunk<
  Agent,
  { description: string; instructions: string }
>('agents/human/participant/saveNew', async ({ description, name }) => {
  const response = await IpcService.send<{ agent: any }>(
    POST_ONE_HUMAN_PARTICIPANT_CHANNEL,
    {
      params: {
        description,
        name,
      },
    },
  );
  return response;
});

export const deleteAgent = createAsyncThunk<string | number, string | number>(
  'agents/deleteAgent',
  async (id) => {
    const response = await IpcService.send<{ agent: any }>(
      DELETE_AGENT_CHANNEL,
      {
        params: { id },
      },
    );
    log.debug(response);
    return id;
  },
);

const agentsSlice = createSlice({
  name: 'agents',
  initialState,
  reducers: {
    agentDeleted: agentsAdapter.removeOne,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAgents.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAgents.fulfilled, (state, action) => {
        agentsAdapter.setAll(state, action.payload);
        state.status = 'idle';
      })
      .addCase(saveNewAgent.fulfilled, (state, action) => {
        const agent = action.payload;
        agentsAdapter.addOne(state, agent);
      })
      .addCase(saveNewArtificialAssistant.fulfilled, (state, action) => {
        const agent = action.payload;
        agentsAdapter.addOne(state, agent);
      })
      .addCase(saveNewArtificialParticipant.fulfilled, (state, action) => {
        const agent = action.payload;
        agentsAdapter.addOne(state, agent);
      })
      .addCase(saveNewHumanAssistant.fulfilled, (state, action) => {
        const agent = action.payload;
        agentsAdapter.addOne(state, agent);
      })
      .addCase(saveNewHumanParticipant.fulfilled, (state, action) => {
        const agent = action.payload;
        agentsAdapter.addOne(state, agent);
      })
      .addCase(deleteAgent.fulfilled, agentsAdapter.removeOne);
  },
});

export const { agentDeleted } = agentsSlice.actions;

export default agentsSlice.reducer;

export const { selectAll: selectAgents, selectById: selectAgentById } =
  agentsAdapter.getSelectors((state) => state.agents);

export const selectAgentIds = createSelector(
  // First, pass one or more "input selector" functions:
  selectAgents,
  // Then, an "output selector" that receives all the input results as arguments
  // and returns a final result value
  (agents) => agents.map((agent) => agent.id),
);

export const selectAssistants = createSelector(selectAgents, (agents) =>
  agents.filter((agent) => {
    return (
      agent.type === 'ArtificialAssistant' || agent.type === 'HumanAssistant'
    );
  }),
);

export const selectParticipants = createSelector(selectAgents, (agents) =>
  agents.filter((agent) => {
    return (
      agent.type === 'ArtificialParticipant' ||
      agent.type === 'HumanParticipant'
    );
  }),
);

export const selectArtificialAssistants = createSelector(
  selectAgents,
  (agents) =>
    agents.filter((agent) => {
      return agent.type === 'ArtificialAssistant';
    }),
);

export const selectArtificialParticipants = createSelector(
  selectAgents,
  (agents) =>
    agents.filter((agent) => {
      return agent.type === 'ArtificialParticipant';
    }),
);

export const selectHumanAssistants = createSelector(selectAgents, (agents) =>
  agents.filter((agent) => {
    return agent.type === 'HumanAssistant';
  }),
);

export const selectHumanParticipants = createSelector(selectAgents, (agents) =>
  agents.filter((agent) => {
    return agent.type === 'HumanParticipant';
  }),
);
