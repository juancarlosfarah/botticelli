import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import {
  DELETE_MESSAGE_CHANNEL,
  GET_MESSAGES_CHANNEL,
  POST_MESSAGE_CHANNEL,
} from '@shared/channels';
import {
  GENERATE_RESPONSE_CHANNEL,
  POST_MANY_KEY_PRESS_EVENTS_CHANNEL,
} from '@shared/channels';
import {
  PostManyKeyPressEventsHandleResponse,
  PostManyKeyPressEventsParams,
  PostManyKeyPressEventsResponse,
} from '@shared/interfaces/Event';
import {
  GenerateResponseHandlerParams,
  GenerateResponseParams,
  GenerateResponseResponse,
  Message,
} from '@shared/interfaces/Message';
import {
  DeleteOneMessageHandlerParams,
  DeleteOneMessageParams,
  DeleteOneMessageResponse,
  GetManyMessagesParams,
  GetManyMessagesResponse,
  PostOneMessageHandlerParams,
  PostOneMessageParams,
} from '@shared/interfaces/Message';
import log from 'electron-log/renderer';
import delay from 'lodash.delay';

import { IpcService } from '../../services/IpcService';
import { RootState } from '../../store';
import {
  completeExchange,
  dismissExchange,
  fetchExchange,
} from '../exchange/ExchangesSlice';
import { fetchInteraction } from '../interaction/InteractionsSlice';

const scrollToBottom = (): void => {
  // todo: factor out
  const delayInMillis = 500;
  delay(
    () =>
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth',
      }),
    delayInMillis,
  );
};

export const messagesAdapter = createEntityAdapter<Message>();

const initialState = messagesAdapter.getInitialState({
  status: [],
});

// thunk functions
export const fetchMessages = createAsyncThunk<
  GetManyMessagesResponse,
  GetManyMessagesParams
>('messages/fetchMessages', async ({ exchangeId }) => {
  return await IpcService.send<GetManyMessagesResponse, GetManyMessagesParams>(
    GET_MESSAGES_CHANNEL,
    {
      params: { exchangeId },
    },
  );
});

export const saveNewMessage = createAsyncThunk<Message, PostOneMessageParams>(
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

    const response = await IpcService.send<
      Message,
      PostOneMessageHandlerParams
    >(POST_MESSAGE_CHANNEL, {
      params: { exchangeId, content, sender, inputType },
    });

    // debug
    log.debug(`saveNewMessage response`);

    // todo: save keypress data
    if (response?.id && keyPressEvents) {
      log.debug('saving keypress events');
      dispatch(
        postManyKeyPressEvents({ messageId: response.id, keyPressEvents }),
      );
    }

    // generate a response
    if (evaluate) {
      dispatch(generateResponse({ exchangeId, interactionId }));
    } else {
      dispatch(completeExchange(exchangeId));
    }

    return response;
  },
);

export const generateResponse = createAsyncThunk<
  GenerateResponseResponse,
  GenerateResponseParams
>(
  'messages/generateResponse',
  async ({ exchangeId, interactionId }, { dispatch }) => {
    // debug
    log.debug(`generateResponse:`, exchangeId);

    const response = await IpcService.send<
      GenerateResponseResponse,
      GenerateResponseHandlerParams
    >(GENERATE_RESPONSE_CHANNEL, {
      params: { exchangeId },
    });

    dispatch(fetchExchange({ id: exchangeId }));
    dispatch(fetchInteraction({ id: interactionId }));

    // debug
    log.debug(`generateResponse response`);

    return response;
  },
);

export const deleteMessage = createAsyncThunk<
  DeleteOneMessageResponse,
  DeleteOneMessageHandlerParams
>('messages/deleteMessage', async (id) => {
  await IpcService.send<DeleteOneMessageResponse, DeleteOneMessageParams>(
    DELETE_MESSAGE_CHANNEL,
    {
      params: { id },
    },
  );
  log.debug(`deleteMessage response`);
  return id;
});

export const postManyKeyPressEvents = createAsyncThunk<
  PostManyKeyPressEventsResponse,
  PostManyKeyPressEventsParams
>('events/postManyKeyPressEvents', async ({ messageId, keyPressEvents }) => {
  log.debug(`postManyKeyPressEvents request`);
  await IpcService.send<
    PostManyKeyPressEventsHandleResponse,
    PostManyKeyPressEventsParams
  >(POST_MANY_KEY_PRESS_EVENTS_CHANNEL, {
    params: {
      messageId,
      keyPressEvents,
    },
  });
  log.debug(`postManyKeyPressEvents response`);
});

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    messageDeleted: messagesAdapter.removeOne,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        // adds a '1' to the loading queue
        state.status = [...state.status, '1' as never];
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        // debug
        log.debug(
          `fetchMessages.fulfilled: ${action.payload?.length} messages`,
        );
        messagesAdapter.setAll(state, action.payload);
        // removes the last element from the loading queue
        state.status = state.status.slice(0, -1);
      })
      .addCase(saveNewMessage.pending, (state) => {
        // adds a '1' to the loading queue
        state.status = [...state.status, '1' as never];
      })
      .addCase(saveNewMessage.fulfilled, (state, action) => {
        messagesAdapter.addOne(state, action.payload);
        state.status = state.status.slice(0, -1);
        scrollToBottom();
      })
      .addCase(generateResponse.pending, (state) => {
        // adds a '1' to the loading queue
        state.status = [...state.status, '1' as never];
        scrollToBottom();
      })
      .addCase(generateResponse.fulfilled, (state, action) => {
        if (action.payload) {
          messagesAdapter.addOne(state, action.payload);
        }
        // removes the last element from the loading queue
        state.status = state.status.slice(0, -1);
        scrollToBottom();
      })
      .addCase(deleteMessage.fulfilled, messagesAdapter.removeOne);
  },
});

export const { messageDeleted } = messagesSlice.actions;

export default messagesSlice.reducer;

export const { selectAll: selectMessages, selectById: selectMessageById } =
  messagesAdapter.getSelectors((state: RootState) => state.messages);

export const selectMessageIds = createSelector(
  // First, pass one or more "input selector" functions:
  selectMessages,
  // Then, an "output selector" that receives all the input results as arguments
  // and returns a final result value
  (messages) => messages.map((message) => message.id),
);
