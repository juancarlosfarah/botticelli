import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import {
  DELETE_ONE_INTERACTION_TEMPLATE_CHANNEL,
  GET_MANY_INTERACTION_TEMPLATES_CHANNEL,
  GET_ONE_INTERACTION_TEMPLATE_CHANNEL,
  POST_ONE_INTERACTION_TEMPLATE_CHANNEL,
} from '@shared/channels';
import InteractionTemplate from '@shared/interfaces/InteractionTemplate';
import log from 'electron-log/renderer';

import { IpcService } from '../../services/IpcService';

const interactionTemplatesAdapter = createEntityAdapter<InteractionTemplate>();

const initialState = interactionTemplatesAdapter.getInitialState({
  status: 'idle',
});

// thunk functions
export const fetchInteractionTemplate = createAsyncThunk(
  'interactionTemplates/fetchInteractionTemplate',
  async (query) => {
    const response = await IpcService.send<{ interactionTemplate: any }>(
      GET_ONE_INTERACTION_TEMPLATE_CHANNEL,
      {
        params: { query },
      },
    );

    // debugging
    log.debug(response);

    return response;
  },
);

export const fetchInteractionTemplates = createAsyncThunk(
  'interactionTemplates/fetchInteractionTemplates',
  async () => {
    return await IpcService.send<{ interactionTemplates: any }>(
      GET_MANY_INTERACTION_TEMPLATES_CHANNEL,
    );
  },
);

export const saveNewInteractionTemplate = createAsyncThunk<
  InteractionTemplate,
  {
    name: string;
    description: string;
    modelInstructions: string;
    participantInstructions: string;
    exchangeTemplates: string[];
  }
>(
  'interactionTemplates/saveNewInteractionTemplate',
  async ({
    description,
    modelInstructions,
    participantInstructions,
    name,
    exchangeTemplates,
  }) => {
    const response = await IpcService.send<{ interactionTemplate: any }>(
      POST_ONE_INTERACTION_TEMPLATE_CHANNEL,
      {
        params: {
          name,
          description,
          modelInstructions,
          participantInstructions,
          exchangeTemplates,
        },
      },
    );
    return response;
  },
);

export const deleteInteractionTemplate = createAsyncThunk<
  string | number,
  string | number
>('interactionTemplates/deleteInteractionTemplate', async (id) => {
  const response = await IpcService.send<{ interactionTemplate: any }>(
    DELETE_ONE_INTERACTION_TEMPLATE_CHANNEL,
    {
      params: { id },
    },
  );
  log.debug(response);
  return id;
});

const interactionTemplatesSlice = createSlice({
  name: 'interactionTemplates',
  initialState,
  reducers: {
    interactionTemplateDeleted: interactionTemplatesAdapter.removeOne,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInteractionTemplates.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchInteractionTemplates.fulfilled, (state, action) => {
        interactionTemplatesAdapter.setAll(state, action.payload);
        state.status = 'idle';
      })
      .addCase(fetchInteractionTemplate.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchInteractionTemplate.fulfilled, (state, action) => {
        interactionTemplatesAdapter.setOne(state, action.payload);
        state.status = 'idle';
      })
      .addCase(saveNewInteractionTemplate.fulfilled, (state, action) => {
        const interactionTemplate = action.payload;
        interactionTemplatesAdapter.addOne(state, interactionTemplate);
      })
      .addCase(
        deleteInteractionTemplate.fulfilled,
        interactionTemplatesAdapter.removeOne,
      );
  },
});

export const { interactionTemplateDeleted } = interactionTemplatesSlice.actions;

export default interactionTemplatesSlice.reducer;

export const {
  selectAll: selectInteractionTemplates,
  selectById: selectInteractionTemplateById,
} = interactionTemplatesAdapter.getSelectors(
  (state) => state.interactionTemplates,
);

export const selectInteractionTemplateIds = createSelector(
  // First, pass one or more "input selector" functions:
  selectInteractionTemplates,
  // Then, an "output selector" that receives all the input results as arguments
  // and returns a final result value
  (interactionTemplates) =>
    interactionTemplates.map((interactionTemplate) => interactionTemplate.id),
);
