import {
  PayloadAction,
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import { RootState } from '@renderer/store';
import {
  GET_SETTING_CHANNEL,
  PATCH_ONE_SETTING_CHANNEL,
} from '@shared/channels';
import User from '@shared/enums/User';
import Setting, { PatchOneSettingParams } from '@shared/interfaces/Setting';

import { IpcService } from '../../services/IpcService';

const settingsAdapter = createEntityAdapter<Setting>({
  selectId: (setting) => setting.username,
});

const initialState = settingsAdapter.getInitialState({
  status: 'idle',
  currentUser: User.LNCO,
});

// thunk functions
export const fetchSettings = createAsyncThunk(
  'settings/fetchSettings',
  async ({ username }: { username: User }) => {
    const response = await IpcService.send<{ settings: Setting }>(
      GET_SETTING_CHANNEL,
      { params: { query: { username } } },
    );
    return response.settings;
  },
);

export const editSetting = createAsyncThunk<Setting, PatchOneSettingParams>(
  'settings/editSetting',
  async ({ username, modelProvider, model, apiKey, language }) => {
    const response = await IpcService.send<Setting, PatchOneSettingParams>(
      PATCH_ONE_SETTING_CHANNEL,
      {
        params: { username, modelProvider, model, apiKey, language },
      },
    );
    return response;
  },
);

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setCurrentUser(state, action: PayloadAction<User>) {
      state.currentUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSettings.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        settingsAdapter.setOne(state, action.payload);
        state.status = 'idle';
      })

      .addCase(editSetting.fulfilled, (state, action) => {
        settingsAdapter.upsertOne(state, action.payload);
        state.status = 'idle';
      });
  },
});

export default settingsSlice.reducer;

export const { selectAll: selectAllSettings, selectById: selectSettingByName } =
  settingsAdapter.getSelectors(
    (state: RootState) => state.settings || initialState,
  );

export const selectCurrentUserSetting = createSelector(
  (state: RootState) => state.settings.entities[state.settings.currentUser],
  (setting) => setting,
);

export const selectApiKey = createSelector(
  selectCurrentUserSetting,
  (setting) => setting?.apiKey ?? '',
);

export const selectModelProvider = createSelector(
  selectCurrentUserSetting,
  (setting) => setting?.modelProvider ?? '',
);

export const selectModel = createSelector(
  selectCurrentUserSetting,
  (setting) => setting?.model ?? '',
);

export const selectLanguage = createSelector(
  selectCurrentUserSetting,
  (setting) => setting?.language ?? '',
);

export const selectSettingByUsername =
  (username: string): ((state: RootState) => Setting | undefined) =>
  (state: RootState) =>
    state.settings.entities[username];

export const { setCurrentUser } = settingsSlice.actions;
