import { useSelector } from 'react-redux';

import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import {
  GENERATE_AUDIO_TRANSCRIPTION_CHANNEL,
  POST_AUDIOS_CHANNEL,
  POST_ONE_AUDIO_CHANNEL,
  SEND_AUDIOS_CHANNEL,
} from '@shared/channels';
import { GET_MANY_AUDIOS_CHANNEL } from '@shared/channels';
import InputType from '@shared/enums/InputType';
import {
  AddAudiosParams,
  Audio,
  GenerateAudioTranscriptionParams,
  GetManyAudiosResponse,
  PostManyAudiosParams,
  PostOneAudioHandlerParams,
  PostOneAudioParams,
  SendAudiosMessageParams,
} from '@shared/interfaces/Audio';
import { GetManyAudiosParams } from '@shared/interfaces/Audio';
import { Message, PostOneMessageParams } from '@shared/interfaces/Message';
import log from 'electron-log/renderer';

import { IpcService } from '../../services/IpcService';
import { RootState } from '../../store';
import { selectMessageById, updateMessage } from './MessagesSlice';
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
      log.debug('blobPath from AudiosSlice: ', response.blobPath);
      const transcription = await dispatch(
        transcribeAudio({ blobPath: response.blobPath }),
      ).unwrap();
      response.transcription = transcription;
      // log.debug('transcription: ', transcription);
    }
    log.debug(`after transcript`);

    return response;
  },
);

export const transcribeAudio = createAsyncThunk<
  string,
  GenerateAudioTranscriptionParams
>('audios/transcribeAudios', async ({ blobPath }) => {
  return await IpcService.send<string, GenerateAudioTranscriptionParams>(
    GENERATE_AUDIO_TRANSCRIPTION_CHANNEL,
    {
      params: { blobPath },
    },
  );
});

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

async function convertArrayBufferToBlob(arrayBuffer) {
  const uint8Array = new Uint8Array(arrayBuffer);
  log.debug('uint8Array of length ', uint8Array.length);
  const audioBlob = new Blob([uint8Array], { type: 'audio/wav' });
  log.debug('audioBlob of length ', audioBlob.size);

  return audioBlob;
}

export const addAudioToMessage = createAsyncThunk<string, AddAudiosParams>(
  'audios/addAudioToMessage',
  async ({ messageId, blobs }, { dispatch, getState }) => {
    console.log('adding audio to message', messageId);

    // Dispatch an action to update the message with the new audio blobs
    dispatch(
      updateMessage({
        id: messageId,
        changes: {
          audioBlobs: blobs,
        },
      }),
    );

    const message = useSelector((state: RootState) =>
      selectMessageById(state, messageId),
    );

    if (message) {
      if (message.audioBlobs) {
        console.log('message blob of length', message.audioBlobs.length);
      } else {
        console.log('no audio blobs');
      }
    } else {
      console.log('no message found');
    }
    return messageId;
  },
);

export const sendAudios = createAsyncThunk<Message, SendAudiosMessageParams>(
  'audios/sendAudios',
  async (
    {
      interactionId,
      exchangeId,
      content,
      evaluate,
      sender,
      keyPressEvents,
      inputType,
      audios,
    },
    { dispatch },
  ) => {
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

    log.debug('before postAudios');
    await dispatch(
      postAudios({
        message: newMessage,
        savedAudios: audios,
      }),
    );
    log.debug('after postAudios ');

    const buffers = await dispatch(
      getManyAudios({ messageId: newMessage.id }),
    ).unwrap();

    log.debug('buffer in AudiosSlice of size ', buffers.length);

    const audioBlobs: Blob[] = [];
    log.debug('audioBlobs initialized');
    for (const arrayBuffer of buffers) {
      log.debug('inside loop');

      const audioBlob = await convertArrayBufferToBlob(arrayBuffer);
      console.log('blob of length ', audioBlob.size);

      audioBlobs.push(audioBlob);
    }
    log.debug('message blobs of length ', audioBlobs.length);

    await dispatch(
      addAudioToMessage({ messageId: newMessage.id, blobs: audioBlobs }),
    );

    return newMessage;
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
        state.status.toSend = 'loading';
      })
      .addCase(transcribeAudio.fulfilled, (state) => {
        state.status.toSend = 'idle';
      });
  },
});

export default audiosSlice.reducer;
export const { deleteAudio, removeAudios } = audiosSlice.actions;

export const { selectAll: selectAudios, selectById: selectAudioById } =
  audiosAdapter.getSelectors((state: RootState) => state.audios);
