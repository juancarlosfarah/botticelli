import { useSelector } from 'react-redux';

import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from '@reduxjs/toolkit';
import {
  DELETE_ONE_AUDIO_CHANNEL,
  GENERATE_AUDIO_TRANSCRIPTION_CHANNEL,
  POST_AUDIOS_CHANNEL,
  POST_ONE_AUDIO_CHANNEL,
} from '@shared/channels';
import { GET_MANY_AUDIOS_CHANNEL } from '@shared/channels';
import InputType from '@shared/enums/InputType';
import {
  AddAudiosParams,
  Audio,
  DeleteOneAudioParams,
  GenerateAudioTranscriptionParams,
  GetManyAudiosResponse,
  PostManyAudiosParams,
  PostOneAudioHandlerParams,
  PostOneAudioParams,
  SendAudiosMessageParams,
} from '@shared/interfaces/Audio';
import { GetManyAudiosParams } from '@shared/interfaces/Audio';
import { Message } from '@shared/interfaces/Message';
import log from 'electron-log/renderer';

import { IpcService } from '../../services/IpcService';
import { RootState } from '../../store';
import { updateMessage } from './MessagesSlice';
import { saveNewMessage } from './MessagesSlice';

export const audiosAdapter = createEntityAdapter<Audio>();

const initialState = audiosAdapter.getInitialState({
  status: { recording: 'idle', toSend: 'idle' },
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
  'audios/saveNewAudio',
  async ({ exchangeId, blob, interactionId }) => {
    const blobBuffer = await blobToArrayBuffer(blob);
    const response = await IpcService.send<Audio, PostOneAudioHandlerParams>(
      POST_ONE_AUDIO_CHANNEL,
      {
        params: { exchangeId, interactionId, blobBuffer },
      },
    );
    return response;
  },
);

export const transcribeAudio = createAsyncThunk<
  string,
  GenerateAudioTranscriptionParams
>(
  'audios/transcribeAudio',
  async ({ blobPath, exchangeId, participantId, audioId }) => {
    console.log('[THUNK] Transcribing:', blobPath);

    const response = await IpcService.send<
      string,
      GenerateAudioTranscriptionParams
    >(GENERATE_AUDIO_TRANSCRIPTION_CHANNEL, {
      params: { blobPath, exchangeId, participantId, audioId },
    });

    const safeResponse =
      typeof response === 'string' ? response : JSON.stringify(response);

    console.log('[THUNK] Received transcription:', safeResponse);
    return safeResponse;
  },
);

export const transcribeAndSendAudio = createAsyncThunk<
  void,
  {
    exchangeId: string;
    interactionId: string;
    blobPath: string;
    participantId: string;
    audioId: string;
  }
>(
  'audios/transcribeAndSendAudio',
  async (
    { exchangeId, interactionId, blobPath, participantId, audioId },
    { dispatch },
  ) => {
    const transcription = await dispatch(
      transcribeAudio({ blobPath, exchangeId, participantId, audioId }),
    ).unwrap();

    if (transcription?.trim()) {
      try {
        await dispatch(
          saveNewMessage({
            interactionId,
            exchangeId,
            content: transcription || '',
            evaluate: true,
            sender: {
              id: participantId,
              type: 'user',
            },
            keyPressEvents: [],
            inputType: InputType.Voice,
          }),
        ).unwrap();
      } catch (error) {
        log.error('Failed to save transcribed message:', error);
      }
    }
  },
);

export const postAudios = createAsyncThunk<
  GetManyAudiosResponse,
  PostManyAudiosParams
>('audios/postAudios', async ({ message, savedAudios: audios }) => {
  return await IpcService.send<GetManyAudiosResponse, PostManyAudiosParams>(
    POST_AUDIOS_CHANNEL,
    {
      params: { message, savedAudios: audios },
    },
  );
});
export const deleteOneAudio = createAsyncThunk<string, DeleteOneAudioParams>(
  'audios/deleteOneAudio',
  async ({ audioId }) => {
    return await IpcService.send<string, DeleteOneAudioParams>(
      DELETE_ONE_AUDIO_CHANNEL,
      {
        params: { audioId },
      },
    );
  },
);
async function convertArrayBufferToBlob(arrayBuffer) {
  const uint8Array = new Uint8Array(arrayBuffer);
  log.debug('uint8Array of length ', uint8Array.length);
  const audioBlob = new Blob([uint8Array], { type: 'audio/wav' });
  log.debug('audioBlob of length ', audioBlob.size);

  return audioBlob;
}

export const addAudioToMessage = createAsyncThunk<string, AddAudiosParams>(
  'audios/addAudioToMessage',
  async ({ messageId, blobs }, { dispatch }) => {
    dispatch(
      updateMessage({
        id: messageId,
        changes: {
          audioBlobs: blobs,
        },
      }),
    );
    return messageId;
  },
);

export const sendAudios = createAsyncThunk<
  Message,
  SendAudiosMessageParams & { blobs: Blob[]; participantId: string }
>(
  'audios/sendAudios',
  async (
    {
      interactionId,
      exchangeId,
      content,
      evaluate,
      keyPressEvents,
      inputType,
      audios,
      blobs,
      sender,
    },
    { dispatch },
  ) => {
    // Step 1: Save message with optimistic UI blobs
    const optimisticMessage = await dispatch(
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

    // Show temporary blobs immediately
    await dispatch(
      addAudioToMessage({
        messageId: optimisticMessage.id,
        blobs,
      }),
    );

    dispatch(removeAudios());

    // Step 2: Send audio to backend
    await dispatch(
      postAudios({
        message: optimisticMessage,
        savedAudios: audios,
      }),
    );

    // Step 3: Retrieve real audio blobs from backend
    const buffers = await dispatch(
      getManyAudios({ messageId: optimisticMessage.id }),
    ).unwrap();

    const audioBlobs: Blob[] = [];
    for (const buffer of buffers) {
      const blob = await convertArrayBufferToBlob(buffer);
      audioBlobs.push(blob);
    }

    await dispatch(
      addAudioToMessage({
        messageId: optimisticMessage.id,
        blobs: audioBlobs,
      }),
    );

    return optimisticMessage;
  },
);

export const getManyAudios = createAsyncThunk<
  ArrayBuffer[],
  GetManyAudiosParams
>('audios/getManyAudios', async ({ messageId }) => {
  return await IpcService.send<ArrayBuffer[], GetManyAudiosParams>(
    GET_MANY_AUDIOS_CHANNEL,
    {
      params: { messageId },
    },
  );
});
const audiosSlice = createSlice({
  name: 'audios',
  initialState,
  reducers: {
    deleteAudio: audiosAdapter.removeOne,
    removeAudios: audiosAdapter.removeAll,
    resetAudioStatus(state) {
      state.status.toSend = 'idle';
      state.status.recording = 'idle';
    },
  },
  extraReducers(builder) {
    builder
      .addCase(sendAudios.pending, (state) => {
        state.status.toSend = 'loading';
      })
      .addCase(sendAudios.fulfilled, (state, action) => {
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
        console.log('[REDUX] transcribeAudio.pending');
        state.status.toSend = 'loading';
      })
      .addCase(transcribeAudio.fulfilled, (state) => {
        console.log('[REDUX] transcribeAudio.fulfilled');
        state.status.toSend = 'idle';
      })
      .addCase(transcribeAudio.rejected, (state, action) => {
        console.error('[REDUX] transcribeAudio.rejected:', action.error);
        state.status.toSend = 'idle';
      })

      .addCase(sendAudios.rejected, (state, action) => {
        console.error('[REDUX] sendAudios.rejected:', action.error);
        state.status.toSend = 'idle';
      })
      .addCase(postAudios.rejected, (state) => {
        state.status.toSend = 'idle';
      });
  },
});

export default audiosSlice.reducer;
export const { deleteAudio, removeAudios, resetAudioStatus } =
  audiosSlice.actions;

export const { selectAll: selectAudios, selectById: selectAudioById } =
  audiosAdapter.getSelectors((state: RootState) => state.audios);
