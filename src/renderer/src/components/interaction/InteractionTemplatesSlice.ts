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
import {
  DeleteOneInteractionTemplateParams,
  GetManyInteractionTemplatesResponse,
  GetOneInteractionTemplateParams,
  GetOneInteractionTemplateResponse,
  PostOneInteractionTemplateParams,
  PostOneInteractionTemplateResponse,
} from '@shared/interfaces/InteractionTemplate';

import { IpcService } from '../../services/IpcService';
import { RootState } from '../../store';

const interactionTemplatesAdapter = createEntityAdapter<InteractionTemplate>();

const initialState = interactionTemplatesAdapter.getInitialState({
  status: 'idle',
});

// thunk functions
export const fetchInteractionTemplate = createAsyncThunk<
  GetOneInteractionTemplateResponse,
  GetOneInteractionTemplateParams
>('interactionTemplates/fetchInteractionTemplate', async (params) => {
  const response = await IpcService.send<
    GetOneInteractionTemplateResponse,
    GetOneInteractionTemplateParams
  >(GET_ONE_INTERACTION_TEMPLATE_CHANNEL, {
    params,
  });

  return response;
});

export const fetchInteractionTemplates =
  createAsyncThunk<GetManyInteractionTemplatesResponse>(
    'interactionTemplates/fetchInteractionTemplates',
    async () => {
      return await IpcService.send<GetManyInteractionTemplatesResponse>(
        GET_MANY_INTERACTION_TEMPLATES_CHANNEL,
      );
    },
  );

export const saveNewInteractionTemplate = createAsyncThunk<
  PostOneInteractionTemplateResponse,
  PostOneInteractionTemplateParams
>(
  'interactionTemplates/saveNewInteractionTemplate',
  async ({
    description,
    modelInstructions,
    participantInstructions,
    participantInstructionsOnComplete,
    name,
    exchangeTemplates,
  }) => {
    return await IpcService.send<
      PostOneInteractionTemplateResponse,
      PostOneInteractionTemplateParams
    >(POST_ONE_INTERACTION_TEMPLATE_CHANNEL, {
      params: {
        name,
        description,
        modelInstructions,
        participantInstructions,
        participantInstructionsOnComplete,
        exchangeTemplates,
      },
    });
  },
);

export const deleteInteractionTemplate = createAsyncThunk<
  string,
  DeleteOneInteractionTemplateParams
>('interactionTemplates/deleteInteractionTemplate', async (id) => {
  await IpcService.send<InteractionTemplate, { id }>(
    DELETE_ONE_INTERACTION_TEMPLATE_CHANNEL,
    {
      params: { id },
    },
  );
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
  (state: RootState) => state.interactionTemplates,
);

export const selectInteractionTemplateIds = createSelector(
  // First, pass one or more "input selector" functions:
  selectInteractionTemplates,
  // Then, an "output selector" that receives all the input results as arguments
  // and returns a final result value
  (interactionTemplates) =>
    interactionTemplates.map((interactionTemplate) => interactionTemplate.id),
);
