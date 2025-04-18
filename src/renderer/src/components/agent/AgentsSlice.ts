import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import {
  DELETE_AGENT_CHANNEL,
  GET_AGENTS_CHANNEL,
  GET_AGENT_CHANNEL,
  PATCH_ONE_ARTIFICIAL_ASSISTANT_CHANNEL,
  PATCH_ONE_ARTIFICIAL_EVALUATOR_CHANNEL,
  PATCH_ONE_ARTIFICIAL_PARTICIPANT_CHANNEL,
  PATCH_ONE_HUMAN_ASSISTANT_CHANNEL,
  PATCH_ONE_HUMAN_PARTICIPANT_CHANNEL,
  POST_AGENT_CHANNEL,
  POST_ONE_ARTIFICIAL_ASSISTANT_CHANNEL,
  POST_ONE_ARTIFICIAL_EVALUATOR_CHANNEL,
  POST_ONE_ARTIFICIAL_PARTICIPANT_CHANNEL,
  POST_ONE_HUMAN_ASSISTANT_CHANNEL,
  POST_ONE_HUMAN_PARTICIPANT_CHANNEL,
} from '@shared/channels';
import Agent, { PatchOneAgentParams } from '@shared/interfaces/Agent';
import log from 'electron-log/renderer';

import { IpcService } from '../../services/IpcService';

const agentsAdapter = createEntityAdapter<Agent>();

const initialState = agentsAdapter.getInitialState({
  status: 'idle',
});

// thunk functions
export const fetchAgent = createAsyncThunk(
  'agents/fetchAgent',
  async (query) => {
    const response = await IpcService.send<{ agent: Agent }>(
      GET_AGENT_CHANNEL,
      {
        params: { query },
      },
    );

    // debugging
    log.debug(response);

    return response;
  },
);

export const fetchAgents = createAsyncThunk(
  'agents/fetchAgents',
  async ({ email }: { email: string }) => {
    const response = await IpcService.send<{ agents: Agent[] }>(
      GET_AGENTS_CHANNEL,
      {
        params: { email },
      },
    );
    return response;
  },
);

export const saveNewAgent = createAsyncThunk<
  Agent,
  { description: string; instructions: string; name: string; email: string }
>('agents/saveNewAgent', async ({ description, name, email }) => {
  const response = await IpcService.send<Agent>(POST_AGENT_CHANNEL, {
    params: {
      description,
      name,
      email,
    },
  });
  return response;
});

export const saveNewArtificialAssistant = createAsyncThunk<
  Agent,
  { description: string; instructions: string }
>(
  'agents/artificial/assistants/saveNew',
  async ({ description, name, email }) => {
    const response = await IpcService.send<{ agent: Agent }>(
      POST_ONE_ARTIFICIAL_ASSISTANT_CHANNEL,
      {
        params: {
          description,
          name,
          email,
        },
      },
    );
    return response;
  },
);

export const saveNewArtificialParticipant = createAsyncThunk<
  Agent,
  { description: string; instructions: string }
>(
  'agents/artificial/participant/saveNew',
  async ({ description, name, email }) => {
    const response = await IpcService.send<{ agent: Agent }>(
      POST_ONE_ARTIFICIAL_PARTICIPANT_CHANNEL,
      {
        params: {
          description,
          name,
          email,
        },
      },
    );
    return response;
  },
);

export const saveNewArtificialEvaluator = createAsyncThunk<
  Agent,
  { description: string; instructions: string }
>(
  'agents/artificial/evaluator/saveNew',
  async ({ description, name, email }) => {
    const response = await IpcService.send<{ agent: Agent }>(
      POST_ONE_ARTIFICIAL_EVALUATOR_CHANNEL,
      {
        params: {
          description,
          name,
          email,
        },
      },
    );
    return response;
  },
);

export const saveNewHumanAssistant = createAsyncThunk<
  Agent,
  { description: string; instructions: string }
>('agents/human/assistants/saveNew', async ({ description, name, email }) => {
  const response = await IpcService.send<{ agent: Agent }>(
    POST_ONE_HUMAN_ASSISTANT_CHANNEL,
    {
      params: {
        description,
        name,
        email,
      },
    },
  );
  return response;
});

export const saveNewHumanParticipant = createAsyncThunk<
  Agent,
  { description: string; instructions: string }
>('agents/human/participant/saveNew', async ({ description, name, email }) => {
  const response = await IpcService.send<{ agent: Agent }>(
    POST_ONE_HUMAN_PARTICIPANT_CHANNEL,
    {
      params: {
        description,
        name,
        email,
      },
    },
  );
  return response;
});

export const deleteAgent = createAsyncThunk<string | number, string | number>(
  'agents/deleteAgent',
  async (id) => {
    const response = await IpcService.send<{ agent: Agent }>(
      DELETE_AGENT_CHANNEL,
      {
        params: { id },
      },
    );
    log.debug(response);
    return id;
  },
);

export const editArtificialAssistant = createAsyncThunk<
  Agent,
  PatchOneAgentParams
>('agents/editArtificialAssistant', async ({ id, name, description }) => {
  log.debug('Editing artificial assistant:', { id, name, description });
  const response = await IpcService.send<Agent, PatchOneAgentParams>(
    PATCH_ONE_ARTIFICIAL_ASSISTANT_CHANNEL,
    {
      params: { id, name, description },
    },
  );
  return response;
});
export const editArtificialEvaluator = createAsyncThunk<
  Agent,
  PatchOneAgentParams
>('agents/editArtificialEvaluator', async ({ id, name, description }) => {
  console.log(id, name, description);
  const response = await IpcService.send<Agent, PatchOneAgentParams>(
    PATCH_ONE_ARTIFICIAL_EVALUATOR_CHANNEL,
    {
      params: { id, name, description },
    },
  );
  return response;
});

export const editArtificialParticipant = createAsyncThunk<
  Agent,
  PatchOneAgentParams
>('agents/editArtificialParticipant', async ({ id, name, description }) => {
  console.log(id, name, description);
  const response = await IpcService.send<Agent, PatchOneAgentParams>(
    PATCH_ONE_ARTIFICIAL_PARTICIPANT_CHANNEL,
    {
      params: { id, name, description },
    },
  );
  return response;
});

export const editHumanAssistant = createAsyncThunk<Agent, PatchOneAgentParams>(
  'agents/editHumanAssistant',
  async ({ id, name, description }) => {
    log.debug('Editing human assistant:', { id, name, description });
    const response = await IpcService.send<Agent, PatchOneAgentParams>(
      PATCH_ONE_HUMAN_ASSISTANT_CHANNEL,
      {
        params: { id, name, description },
      },
    );
    return response;
  },
);

export const editHumanParticipant = createAsyncThunk<
  Agent,
  PatchOneAgentParams
>('agents/editHumanParticipant', async ({ id, name, description }) => {
  log.debug('Editing human participant:', { id, name, description });
  const response = await IpcService.send<Agent, PatchOneAgentParams>(
    PATCH_ONE_HUMAN_PARTICIPANT_CHANNEL,
    {
      params: { id, name, description },
    },
  );
  return response;
});

const agentsSlice = createSlice({
  name: 'agents',
  initialState,
  reducers: {
    agentDeleted: agentsAdapter.removeOne,
    agentsCleared: agentsAdapter.removeAll,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAgents.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAgents.fulfilled, (state, action) => {
        const email = action.meta.arg.email;
        const filtered = action.payload.agents.filter(
          (agent) => agent.email === email,
        );
        agentsAdapter.setAll(state, filtered);
        state.status = 'idle';
      })

      .addCase(editArtificialAssistant.fulfilled, (state, action) => {
        const agent = action.payload;
        agentsAdapter.setOne(state, agent);
      })
      .addCase(editArtificialEvaluator.fulfilled, (state, action) => {
        const agent = action.payload;
        agentsAdapter.setOne(state, agent);
      })
      .addCase(editArtificialParticipant.fulfilled, (state, action) => {
        const agent = action.payload;
        agentsAdapter.setOne(state, agent);
      })
      .addCase(editHumanAssistant.fulfilled, (state, action) => {
        const agent = action.payload;
        agentsAdapter.setOne(state, agent);
      })
      .addCase(editHumanParticipant.fulfilled, (state, action) => {
        const agent = action.payload;
        agentsAdapter.setOne(state, agent);
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
      .addCase(saveNewArtificialEvaluator.fulfilled, (state, action) => {
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

export const { agentDeleted, agentsCleared } = agentsSlice.actions;

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

export const selectEvaluators = createSelector(selectAgents, (agents) =>
  agents.filter((agent) => {
    return (
      agent.type === 'ArtificialEvaluator' || agent.type === 'HumanEvaluator'
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

export const selectArtificialEvaluators = createSelector(
  selectAgents,
  (agents) =>
    agents.filter((agent) => {
      return agent.type === 'ArtificialEvaluator';
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
