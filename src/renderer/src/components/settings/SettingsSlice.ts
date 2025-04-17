import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import { RootState } from '@renderer/store';
import {
  GET_MANY_SETTINGS_CHANNEL,
  PATCH_ONE_SETTING_CHANNEL,
} from '@shared/channels';
import Setting, { PatchOneSettingParams } from '@shared/interfaces/Setting';

import { IpcService } from '../../services/IpcService';
import { selectCurrentUser } from '../user/UsersSlice';

const settingsAdapter = createEntityAdapter<Setting>({
  selectId: (setting) => setting.email,
});

const initialState = settingsAdapter.getInitialState({
  status: 'idle',
});

// thunk functions
export const fetchSettings = createAsyncThunk<
  { settings: Setting[] },
  { email: string }
>('settings/fetchSettings', async ({ email }) => {
  const response = await IpcService.send<{ settings: Setting[] }>(
    GET_MANY_SETTINGS_CHANNEL,
    { params: { email } },
  );
  return response;
});

export const editSetting = createAsyncThunk<Setting, PatchOneSettingParams>(
  'settings/editSetting',
  async ({ email, modelProvider, model, apiKey, language }) => {
    const response = await IpcService.send<Setting, PatchOneSettingParams>(
      PATCH_ONE_SETTING_CHANNEL,
      {
        params: { email, modelProvider, model, apiKey, language },
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
        const email = action.meta.arg.email;
        const filtered = action.payload.settings.filter(
          (s) => s.email === email,
        );
        filtered.forEach((s) => settingsAdapter.upsertOne(state, s));
        state.status = 'idle';
      })

      .addCase(editSetting.fulfilled, (state, action) => {
        settingsAdapter.upsertOne(state, action.payload);
        state.status = 'idle';
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.status = 'failed';
        console.error('Failed to fetch settings:', action.error);
      });
  },
});

export default settingsSlice.reducer;

const selectors = settingsAdapter.getSelectors<RootState>(
  (state) => state.settings || initialState,
);

export const selectAllSettings = selectors.selectAll;
export const selectSettingByEmail = (state: RootState, email: string) =>
  selectors.selectById(state, email);

export const selectCurrentUserSetting = createSelector(
  [selectAllSettings, selectCurrentUser],
  (settings, email) => settings.find((s) => s.email === email),
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
