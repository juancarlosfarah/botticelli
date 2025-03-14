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

const settingsAdapter = createEntityAdapter<Setting>({
  selectId: (setting) => setting.name,
});

const initialState = settingsAdapter.getInitialState({
  status: 'idle',
});

// thunk functions
export const fetchSettings = createAsyncThunk(
  'settings/fetchSettings',
  async (query) => {
    const response = await IpcService.send<{ settings: any }>(
      GET_SETTING_CHANNEL,
      { params: { query } },
    );
    return [response.settings];
  },
);

export const editSetting = createAsyncThunk<Setting, PatchOneSettingParams>(
  'settings/editSetting',
  async ({ modelProvider, model, apiKey, language }) => {
    const response = await IpcService.send<Setting, PatchOneSettingParams>(
      PATCH_ONE_SETTING_CHANNEL,
      {
        params: { modelProvider, model, apiKey, language },
      },
    );
    return response;
  },
);

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
        settingsAdapter.setAll(state, action.payload);
        state.status = 'idle';
      })
      .addCase(editSetting.fulfilled, (state, action) => {
        const setting = action.payload;
        settingsAdapter.setOne(state, setting);
      });
  },
});

export default settingsSlice.reducer;

export const { selectAll: selectAllSettings, selectById: selectSettingByName } =
  settingsAdapter.getSelectors(
    (state: RootState) => state.settings || initialState,
  );

export const selectApiKey = createSelector(
  selectAllSettings,
  (settings) => settings.find((s) => s.name === 'apiKey')?.value || '',
);

export const selectModelProvider = createSelector(
  selectAllSettings,
  (settings) => settings.find((s) => s.name === 'modelProvider')?.value || '',
);

export const selectModel = createSelector(
  selectAllSettings,
  (settings) => settings.find((s) => s.name === 'model')?.value || '',
);

export const selectLanguage = createSelector(
  selectAllSettings,
  (settings) => settings.find((s) => s.name === 'language')?.value || '',
);
