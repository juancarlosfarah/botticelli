import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import {
  DELETE_ONE_EXCHANGE_TEMPLATE_CHANNEL,
  GET_MANY_EXCHANGE_TEMPLATES_CHANNEL,
  GET_ONE_EXCHANGE_TEMPLATE_CHANNEL,
  POST_ONE_EXCHANGE_TEMPLATE_CHANNEL,
} from '@shared/channels';
import ExchangeTemplate from '@shared/interfaces/ExchangeTemplate';
import {
  DeleteOneExchangeParams,
  GetManyExchangeTemplateResponse,
  GetOneExchangeTemplateParams,
  GetOneExchangeTemplateResponse,
  PostOneExchangeTemplateParams,
  PostOneExchangeTemplateResponse,
} from '@shared/interfaces/ExchangeTemplate';

import { IpcService } from '../../services/IpcService';
import { RootState } from '../../store';

const exchangeTemplatesAdapter = createEntityAdapter<ExchangeTemplate>();

const initialState = exchangeTemplatesAdapter.getInitialState({
  status: 'idle',
});

// thunk functions
export const fetchExchangeTemplate = createAsyncThunk<
  GetOneExchangeTemplateResponse,
  GetOneExchangeTemplateParams
>('exchangeTemplates/fetchExchangeTemplate', async (params) => {
  return await IpcService.send<ExchangeTemplate, GetOneExchangeTemplateParams>(
    GET_ONE_EXCHANGE_TEMPLATE_CHANNEL,
    {
      params,
    },
  );
});

export const fetchExchangeTemplates = createAsyncThunk<
  GetManyExchangeTemplateResponse,
  void
>('exchangeTemplates/fetchExchangeTemplates', async () => {
  return await IpcService.send<ExchangeTemplate[]>(
    GET_MANY_EXCHANGE_TEMPLATES_CHANNEL,
  );
});

export const saveNewExchangeTemplate = createAsyncThunk<
  PostOneExchangeTemplateResponse,
  PostOneExchangeTemplateParams
>(
  'exchangeTemplates/saveNewExchangeTemplate',
  async ({
    name,
    description,
    instructions,
    participantInstructionsOnComplete,
    assistant,
    triggers,
    cue,
    inputType,
    softLimit,
    hardLimit,
  }) => {
    return (await IpcService.send<
      PostOneExchangeTemplateResponse,
      PostOneExchangeTemplateParams
    >(POST_ONE_EXCHANGE_TEMPLATE_CHANNEL, {
      params: {
        name,
        description,
        instructions,
        participantInstructionsOnComplete,
        assistant,
        triggers,
        cue,
        inputType,
        softLimit,
        hardLimit,
      },
    })) as PostOneExchangeTemplateResponse;
  },
);

export const deleteOneExchangeTemplate = createAsyncThunk<
  string,
  DeleteOneExchangeParams
>('exchangeTemplates/deleteExchangeTemplate', async (id) => {
  await IpcService.send<ExchangeTemplate, { id }>(
    DELETE_ONE_EXCHANGE_TEMPLATE_CHANNEL,
    {
      params: { id },
    },
  );
  return id;
});

const exchangeTemplatesSlice = createSlice({
  name: 'exchangeTemplates',
  initialState,
  reducers: {
    exchangeTemplateDeleted: exchangeTemplatesAdapter.removeOne,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExchangeTemplates.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchExchangeTemplates.fulfilled, (state, action) => {
        exchangeTemplatesAdapter.setAll(state, action.payload);
        state.status = 'idle';
      })
      .addCase(fetchExchangeTemplate.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchExchangeTemplate.fulfilled, (state, action) => {
        const exchangeTemplate = action.payload;
        exchangeTemplatesAdapter.setOne(state, exchangeTemplate);
        state.status = 'idle';
      })
      .addCase(saveNewExchangeTemplate.fulfilled, (state, action) => {
        const exchangeTemplate = action.payload;
        exchangeTemplatesAdapter.addOne(state, exchangeTemplate);
      })
      .addCase(
        deleteOneExchangeTemplate.fulfilled,
        exchangeTemplatesAdapter.removeOne,
      );
    // // example of how to add a case that listens to actions from a different slice
    // .addCase(fetchInteractionTemplate.fulfilled, (state, action) => {
    //   const interactionTemplate = action.payload;
    //   const exchangeTemplates = interactionTemplate.exchangeTemplates.map(
    //     (interactionTemplateExchangeTemplate) =>
    //       interactionTemplateExchangeTemplate.exchangeTemplate,
    //   );
    //   exchangeTemplatesAdapter.setMany(state, exchangeTemplates);
    //   state.status = 'idle';
    // });
  },
});

export default exchangeTemplatesSlice.reducer;

export const {
  selectAll: selectAllExchangeTemplates,
  selectById: selectExchangeTemplateById,
} = exchangeTemplatesAdapter.getSelectors(
  (state: RootState) => state.exchangeTemplates,
);

export const selectExchangeTemplateIds = createSelector(
  // First, pass one or more "input selector" functions:
  selectAllExchangeTemplates,
  // Then, an "output selector" that receives all the input results as arguments
  // and returns a final result value
  (exchangeTemplates) =>
    exchangeTemplates.map((exchangeTemplate) => exchangeTemplate.id),
);

// // example of how to add custom arguments to a selector
// export const selectExchangeTemplatesByIds = createSelector(
//   // First, pass one or more "input selector" functions:
//   selectAllExchangeTemplates,
//   (_, ids) => ids,
//   // Then, an "output selector" that receives all the input results as arguments
//   // and returns a final result value
//   (exchangeTemplates, ids = []) => {
//     console.log(exchangeTemplates, ids);
//     return exchangeTemplates.filter((exchangeTemplate) =>
//       ids.includes(exchangeTemplate.id),
//     );
//   },
// );
