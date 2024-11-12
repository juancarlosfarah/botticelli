import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import {
  DELETE_ONE_SOCIAL_CUE_GROUP_CHANNEL,
  GET_MANY_SOCIAL_CUE_GROUPS_CHANNEL,
  GET_ONE_SOCIAL_CUE_GROUP_CHANNEL,
  POST_ONE_SOCIAL_CUE_GROUP_CHANNEL,
} from '@shared/channels';
import SocialCueGroup from '@shared/interfaces/SocialCueGroup';
import {
  DeleteOneSocialCueGroupParams,
  DeleteOneSocialCueGroupResponse,
  GetManySocialCueGroupsResponse,
  GetOneSocialCueGroupParams,
  GetOneSocialCueGroupResponse,
  PostOneSocialCueGroupParams,
  PostOneSocialCueGroupResponse,
} from '@shared/interfaces/SocialCueGroup';

import { IpcService } from '../../services/IpcService';
import { RootState } from '../../store';

const socialCueGroupsAdapter = createEntityAdapter<SocialCueGroup>();

const initialState = socialCueGroupsAdapter.getInitialState({
  status: 'idle',
});

// thunk functions
export const fetchSocialCueGroup = createAsyncThunk<
  GetOneSocialCueGroupResponse,
  GetOneSocialCueGroupParams
>('socialCues/fetchSocialCue', async ({ id }) => {
  const response = await IpcService.send<
    GetOneSocialCueGroupResponse,
    GetOneSocialCueGroupParams
  >(GET_ONE_SOCIAL_CUE_GROUP_CHANNEL, {
    params: { id },
  });
  return response;
});

export const fetchSocialCueGroups = createAsyncThunk<GetManySocialCueGroupsResponse>(
  'socialCues/fetchSocialCueGroups',
  async () => {
    return await IpcService.send<GetManySocialCueGroupsResponse>(
      GET_MANY_SOCIAL_CUE_GROUPS_CHANNEL,
    );
  },
);

export const saveNewSocialCueGroup = createAsyncThunk<
  PostOneSocialCueGroupResponse,
  PostOneSocialCueGroupParams
>(
  'socialCues/saveNewSocialCueGroup',
  async ({ description, name }) => {
    const response = await IpcService.send<SocialCueGroup, PostOneSocialCueGroupParams>(
      POST_ONE_SOCIAL_CUE_GROUP_CHANNEL,
      {
        params: {
          name,
          description,
        },
      },
    );
    console.log('Response:', response);
    return response;
  },
);

export const deleteSocialCueGroup = createAsyncThunk<
  DeleteOneSocialCueGroupResponse,
  DeleteOneSocialCueGroupParams
>('socialCues/deleteSocialCueGroup', async (id) => {
  await IpcService.send<string, { id }>(DELETE_ONE_SOCIAL_CUE_GROUP_CHANNEL, {
    params: { id },
  });
  return id;
});

const socialCueGroupsSlice = createSlice({
  name: 'socialCueGroups',
  initialState,
  reducers: {
    socialCueGroupDeleted: socialCueGroupsAdapter.removeOne,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSocialCueGroups.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSocialCueGroups.fulfilled, (state, action) => {
        socialCueGroupsAdapter.setAll(state, action.payload);
        state.status = 'idle';
      })
      .addCase(fetchSocialCueGroup.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSocialCueGroup.fulfilled, (state, action) => {
        socialCueGroupsAdapter.setOne(state, action.payload);
        state.status = 'idle';
      })
      .addCase(saveNewSocialCueGroup.fulfilled, (state, action) => {
        const SocialCueGroup = action.payload;
        socialCueGroupsAdapter.addOne(state, SocialCueGroup);
      })
      .addCase(deleteSocialCueGroup.fulfilled, socialCueGroupsAdapter.removeOne);
  },
});

export const { socialCueGroupDeleted } = socialCueGroupsSlice.actions;

export default socialCueGroupsSlice.reducer;

export const {
  selectAll: selectSocialCueGroups,
  selectById: selectSocialCueGroupById,
} = socialCueGroupsAdapter.getSelectors((state: RootState) => state.socialCueGroups);

export const selectSocialCueGroupIds = createSelector(
  selectSocialCueGroups,
  (socialCueGroups) => socialCueGroups.map((SocialCueGroup) => SocialCueGroup.id),
);
