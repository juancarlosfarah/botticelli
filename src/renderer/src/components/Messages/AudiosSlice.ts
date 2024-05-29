import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import {
  GENERATE_AUDIO_TRANSCRIPTION_CHANNEL,
  GET_AUDIOS_CHANNEL,
  POST_ONE_AUDIO_CHANNEL,
  SEND_AUDIOS_CHANNEL,
} from '@shared/channels';
import {
  Audio,
  GenerateAudioTranscriptionParams,
  GetManyAudiosParams,
  GetManyAudiosResponse,
  PostOneAudioHandlerParams,
  PostOneAudioParams,
} from '@shared/interfaces/Audio';
import { Message, PostOneMessageParams } from '@shared/interfaces/Message';
import log from 'electron-log/renderer';

import { IpcService } from '../../services/IpcService';
import { RootState } from '../../store';
import { saveNewMessage } from './MessagesSlice';

export const audiosAdapter = createEntityAdapter<Audio>();

const initialState = audiosAdapter.getInitialState({
  status: { recording: 'idle', toSend: 'loading' },
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
      const transcription = await dispatch(
        transcribeAudio({ exchangeId, blobPath: response.blobPath }),
      ).unwrap();
      response.transcription = transcription;
      // log.debug('transcription: ', transcription);
      // return transcription;
    }
    log.debug(`after transcript`);

    return response;
  },
);

export const transcribeAudio = createAsyncThunk<
  string,
  GenerateAudioTranscriptionParams
>('audios/transcribeAudios', async ({ exchangeId, blobPath }) => {
  return await IpcService.send<string, GenerateAudioTranscriptionParams>(
    GENERATE_AUDIO_TRANSCRIPTION_CHANNEL,
    {
      params: { exchangeId, blobPath },
    },
  );
});

export const fetchAudios = createAsyncThunk<
  GetManyAudiosResponse,
  GetManyAudiosParams
>('messages/fetchMessages', async ({ messageId }) => {
  return await IpcService.send<GetManyAudiosResponse, GetManyAudiosParams>(
    GET_AUDIOS_CHANNEL,
    {
      params: { messageId },
    },
  );
});

export const sendAudios = createAsyncThunk<Message, PostOneMessageParams>(
  'messages/saveNewMessage',
  async (
    {
      interactionId,
      exchangeId,
      content,
      evaluate,
      sender,
      keyPressEvents,
      inputType,
    },
    { dispatch },
  ) => {
    // debugging
    log.debug(`saveNewMessage:`, exchangeId, content);
    const newMessage = await dispatch(
      saveNewMessage({
        interactionId,
        exchangeId,
        content,
        evaluate,
        sender,
        keyPressEvents,
        inputType,
      }),
    ).unwrap();

    return newMessage;
  },
);

const audiosSlice = createSlice({
  name: 'audios',
  initialState,
  reducers: {
    audioDeleted: audiosAdapter.removeOne,
  },
  extraReducers(builder) {
    builder
      .addCase(sendAudios.pending, (state) => {
        state.status.toSend = 'loading';
      })
      .addCase(sendAudios.fulfilled, (state, action) => {
        // log.debug(`fetchAudioss.fulfilled: ${action.payload?.length} audios`);
        // audiosAdapter.setAll(state, action.payload);
        audiosAdapter.removeAll(state);
        state.status.toSend = 'idle';
      })
      .addCase(saveNewAudio.pending, (state) => {
        state.status.recording = 'loading';
      })
      .addCase(saveNewAudio.fulfilled, (state, action) => {
        audiosAdapter.addOne(state, action.payload);
        state.status.recording = 'idle';
      })
      .addCase(transcribeAudio.pending, (state) => {
        state.status.toSend = 'loading';
      })
      .addCase(transcribeAudio.fulfilled, (state) => {
        // audiosAdapter.addOne(state, action.payload);
        state.status.toSend = 'idle';
      });
  },
});

export default audiosSlice.reducer;
export const { selectAll: selectAudios, selectById: selectAudioById } =
  audiosAdapter.getSelectors((state: RootState) => state.audios);
