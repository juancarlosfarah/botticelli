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
import Setting, { PatchOneSettingParams } from '@shared/interfaces/Settings';

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
  async () => {
    const response = await IpcService.send<{ settings: Setting }>(
      GET_SETTING_CHANNEL,
    );
    return [response.settings];
  },
);

export const editSetting = createAsyncThunk(
  'settings/editSetting',
  async ({ name, value }: { name: string; value: any }) => {
    await IpcService.send(PATCH_ONE_SETTING_CHANNEL, {
      params: { name, value },
    });

    return { name, value };
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
        const { name, value } = action.payload;
        settingsAdapter.updateOne(state, {
          id: name,
          changes: { value },
        });
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
