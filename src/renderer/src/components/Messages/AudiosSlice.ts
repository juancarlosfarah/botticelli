import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import {
  POST_ONE_AUDIO_CHANNEL,
  TRANSCRIBE_ONE_AUDIO_CHANNEL,
} from '@shared/channels';
import {
  Audio,
  GenerateAudioTranscriptionParams,
  PostOneAudioHandlerParams,
  PostOneAudioParams,
} from '@shared/interfaces/Audio';
import log from 'electron-log/renderer';

import { IpcService } from '../../services/IpcService';
import { RootState } from '../../store';

export const audiosAdapter = createEntityAdapter<Audio>();
const initialState = audiosAdapter.getInitialState({
  status: { recording: 'idle', transcription: 'loading' },
});

export const saveNewAudio = createAsyncThunk<Audio, PostOneAudioParams>(
  'audios/saveNewAudios',
  async ({ exchangeId, blob }, { dispatch }) => {
    log.debug(`saveNewAudio:`, exchangeId);

    const response = await IpcService.send<Audio, PostOneAudioHandlerParams>(
      POST_ONE_AUDIO_CHANNEL,
      {
        params: { exchangeId, blob },
      },
    );
    log.debug(`response before transcript`);
    if (response?.blobPath) {
      log.debug('response ok');
      dispatch(transcribeAudio({ exchangeId, blobPath: response.blobPath }));
    }
    log.debug(`after transcript`);

    return response;
  },
);

export const transcribeAudio = createAsyncThunk<
  Audio,
  GenerateAudioTranscriptionParams
>('audios/transcribeAudios', async ({ exchangeId, blobPath }) => {
  return await IpcService.send<Audio, GenerateAudioTranscriptionParams>(
    TRANSCRIBE_ONE_AUDIO_CHANNEL,
    {
      params: { exchangeId, blobPath },
    },
  );
});

const audiosSlice = createSlice({
  name: 'audios',
  initialState,
  reducers: {
    maudioDeleted: audiosAdapter.removeOne,
  },
  extraReducers(builder) {
    builder.addCase(saveNewAudio.pending, (state) => {
      state.status.recording = 'loading';
    });
    builder.addCase(saveNewAudio.fulfilled, (state, action) => {
      // audiosAdapter.addOne(state, action.payload);
      state.status.recording = 'idle';
    });
    builder.addCase(transcribeAudio.pending, (state) => {
      state.status.transcription = 'loading';
    });
    builder.addCase(transcribeAudio.fulfilled, (state, action) => {
      // audiosAdapter.addOne(state, action.payload);
      state.status.transcription = 'idle';
    });
  },
});

export default audiosSlice.reducer;
/* export const { selectAll: selectAudios, selectById: selectAudioById } =
  audiosAdapter.getSelectors((state: RootState) => state.audios); */
