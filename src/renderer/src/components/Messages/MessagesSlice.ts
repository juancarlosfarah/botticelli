import {
  createSlice,
  createSelector,
  createAsyncThunk,
  createEntityAdapter,
} from '@reduxjs/toolkit';
import { IpcService } from '../../services/IpcService';
import {
  POST_MESSAGE_CHANNEL,
  DELETE_MESSAGE_CHANNEL,
  GET_MESSAGE_CHANNEL,
  GET_MESSAGES_CHANNEL,
} from '@shared/channels';
import { GENERATE_RESPONSE_CHANNEL } from '../../../../shared/channels';

export const messagesAdapter = createEntityAdapter();

const initialState = messagesAdapter.getInitialState({
  status: 'idle',
});

// thunk functions
export const fetchMessage = createAsyncThunk('messages/fetchMessage', async (query) => {
  const response = await IpcService.send<{ message: any }>(GET_MESSAGE_CHANNEL, {
    params: { query },
  });

  // debugging
  console.log(response);

  return response;
});

export const fetchMessages = createAsyncThunk(
  'messages/fetchMessages',
  async ({ conversationId }) => {
    const response = await IpcService.send<{ messages: any }>(GET_MESSAGES_CHANNEL, {
      params: { conversationId },
    });
    return response;
  },
);

export const saveNewMessage = createAsyncThunk(
  'messages/saveNewMessage',
  async ({ conversationId, content }, { dispatch }) => {
    // todo: debug
    console.log(conversationId, content);

    const response = await IpcService.send<{ message: any }>(POST_MESSAGE_CHANNEL, {
      params: { conversationId, content },
    });

    // generate a response
    dispatch(generateResponse({ conversationId }));

    // todo: debug
    console.log(response);
    return response;
  },
);

export const generateResponse = createAsyncThunk(
  'messages/generateResponse',
  async ({ conversationId }) => {
    // todo: debug
    console.debug(conversationId);

    const response = await IpcService.send<{ message: any }>(GENERATE_RESPONSE_CHANNEL, {
      params: { conversationId },
    });

    // todo: debug
    console.debug(response);

    return response;
  },
);

export const deleteMessage = createAsyncThunk('messages/deleteMessage', async (id) => {
  const response = await IpcService.send<{ message: any }>(DELETE_MESSAGE_CHANNEL, {
    params: { id },
  });
  console.debug(response);
  return id;
});

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    messageDeleted: messagesAdapter.removeOne,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        // todo: debug
        console.log(action.payload);
        messagesAdapter.setAll(state, action.payload);
        state.status = 'idle';
      })
      .addCase(saveNewMessage.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(saveNewMessage.fulfilled, messagesAdapter.addOne)
      .addCase(generateResponse.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(generateResponse.fulfilled, (state, action) => {
        messagesAdapter.addOne(state, action.payload);
        state.status = 'idle';
      })
      .addCase(deleteMessage.fulfilled, messagesAdapter.removeOne);
  },
});

export const { messageDeleted } = messagesSlice.actions;

export default messagesSlice.reducer;

export const { selectAll: selectMessages, selectById: selectMessageById } =
  messagesAdapter.getSelectors((state) => state.messages);

export const selectMessageIds = createSelector(
  // First, pass one or more "input selector" functions:
  selectMessages,
  // Then, an "output selector" that receives all the input results as arguments
  // and returns a final result value
  (messages) => messages.map((message) => message.id),
);
