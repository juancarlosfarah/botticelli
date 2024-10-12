import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import {
  DELETE_ONE_SOCIALCUE_CHANNEL,
  GET_MANY_SOCIALCUES_CHANNEL,
  GET_ONE_SOCIALCUE_CHANNEL,
  POST_ONE_SOCIALCUE_CHANNEL,
} from '@shared/channels';
import SocialCue from '@shared/interfaces/SocialCue';
import {
  DeleteOneSocialCueParams,
  DeleteOneSocialCueResponse,
  GetManySocialCuesResponse,
  GetOneSocialCueParams,
  GetOneSocialCueResponse,
  PostOneSocialCueParams,
  PostOneSocialCueResponse,
} from '@shared/interfaces/SocialCue';

import { IpcService } from '../../services/IpcService';
import { RootState } from '../../store';

const socialCuesAdapter = createEntityAdapter<SocialCue>();

const initialState = socialCuesAdapter.getInitialState({
  status: 'idle',
});

// thunk functions
export const fetchSocialCue = createAsyncThunk<
  GetOneSocialCueResponse,
  GetOneSocialCueParams
>('socialCues/fetchSocialCue', async ({ id }) => {
  const response = await IpcService.send<
    GetOneSocialCueResponse,
    GetOneSocialCueParams
  >(GET_ONE_SOCIALCUE_CHANNEL, {
    params: { id },
  });
  return response;
});

export const fetchSocialCues = createAsyncThunk<GetManySocialCuesResponse>(
  'socialCues/fetchSocialCues',
  async () => {
    return await IpcService.send<GetManySocialCuesResponse>(
      GET_MANY_SOCIALCUES_CHANNEL,
    );
  },
);

export const saveNewSocialCue = createAsyncThunk<
  PostOneSocialCueResponse,
  PostOneSocialCueParams
>(
  'socialCues/saveNewSocialCue',
  async ({ description, formulation, name, participants }) => {
    const response = await IpcService.send<SocialCue, PostOneSocialCueParams>(
      POST_ONE_SOCIALCUE_CHANNEL,
      {
        params: {
          name,
          description,
          formulation,
          // interactionTemplates,
          participants,
        },
      },
    );
    return response;
  },
);

export const deleteSocialCue = createAsyncThunk<
  DeleteOneSocialCueResponse,
  DeleteOneSocialCueParams
>('socialCues/deleteSocialCue', async (id) => {
  await IpcService.send<string, { id }>(DELETE_ONE_SOCIALCUE_CHANNEL, {
    params: { id },
  });
  return id;
});

const socialCuesSlice = createSlice({
  name: 'socialCues',
  initialState,
  reducers: {
    socialCueDeleted: socialCuesAdapter.removeOne,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSocialCues.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSocialCues.fulfilled, (state, action) => {
        socialCuesAdapter.setAll(state, action.payload);
        state.status = 'idle';
      })
      .addCase(fetchSocialCue.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSocialCue.fulfilled, (state, action) => {
        socialCuesAdapter.setOne(state, action.payload);
        state.status = 'idle';
      })
      .addCase(saveNewSocialCue.fulfilled, (state, action) => {
        const socialCue = action.payload;
        socialCuesAdapter.addOne(state, socialCue);
      })
      .addCase(deleteSocialCue.fulfilled, socialCuesAdapter.removeOne);
  },
});

export const { socialCueDeleted } = socialCuesSlice.actions;

export default socialCuesSlice.reducer;

export const {
  selectAll: selectSocialCues,
  selectById: selectSocialCueById,
} = socialCuesAdapter.getSelectors((state: RootState) => state.socialCues);

export const selectSocialCueIds = createSelector(
  // First, pass one or more "input selector" functions:
  selectSocialCues,
  // Then, an "output selector" that receives all the input results as arguments
  // and returns a final result value
  (socialCues) => socialCues.map((socialCue) => socialCue.id),
);
