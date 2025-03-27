import {
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
import Setting, { PatchOneSettingParams } from '@shared/interfaces/Setting';

import { IpcService } from '../../services/IpcService';
import { selectCurrentUser } from '../user/UsersSlice';

const settingsAdapter = createEntityAdapter<Setting>({
  selectId: (setting) => setting.userEmail,
});

const initialState = settingsAdapter.getInitialState({
  status: 'idle',
});

// thunk functions
export const fetchSettings = createAsyncThunk(
  'settings/fetchSettings',
  async ({ userEmail }: { userEmail: string }) => {
    const response = await IpcService.send<{ settings: Setting }>(
      GET_SETTING_CHANNEL,
      { params: { query: { userEmail } } },
    );
    return response.settings;
  },
);
export const editSetting = createAsyncThunk<Setting, PatchOneSettingParams>(
  'settings/editSetting',
  async ({ userEmail, modelProvider, model, apiKey, language }) => {
    const response = await IpcService.send<Setting, PatchOneSettingParams>(
      PATCH_ONE_SETTING_CHANNEL,
      {
        params: { userEmail, modelProvider, model, apiKey, language },
      },
    );
    return response;
  },
);

// slice
const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {},
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

const selectors = settingsAdapter.getSelectors<RootState>(
  (state) => state.settings || initialState,
);

export const selectAllSettings = selectors.selectAll;
export const selectSettingByUserEmail = (state: RootState, userEmail: string) =>
  selectors.selectById(state, userEmail);

export const selectCurrentUserSetting = createSelector(
  [selectAllSettings, selectCurrentUser],
  (settings, email) => settings.find((s) => s.userEmail === email),
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
