import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import {
  GENERATE_AUDIO_TRANSCRIPTION_CHANNEL,
  POST_MESSAGE_CHANNEL,
  POST_ONE_AUDIO_CHANNEL,
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

// Convert Blob to ArrayBuffer
async function blobToArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
  return new Promise<ArrayBuffer>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = reject;
    reader.readAsArrayBuffer(blob);
  });
}

export const saveNewAudio = createAsyncThunk<Audio, PostOneAudioParams>(
  'audios/saveNewAudios',
  async ({ exchangeId, blob }, { dispatch }) => {
    log.debug(`saveNewAudio:`, exchangeId);
    const blobBuffer = await blobToArrayBuffer(blob);

    const response = await IpcService.send<Audio, PostOneAudioHandlerParams>(
      POST_ONE_AUDIO_CHANNEL,
      {
        params: { exchangeId, blobBuffer },
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
    GENERATE_AUDIO_TRANSCRIPTION_CHANNEL,
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
