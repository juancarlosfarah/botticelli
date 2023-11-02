import {
  createSlice,
  createSelector,
  createAsyncThunk,
  createEntityAdapter,
} from '@reduxjs/toolkit';
import { IpcService } from '../../services/IpcService';
import {
  DELETE_CONVERSATION_CHANNEL,
  GET_CONVERSATIONS_CHANNEL,
  GET_CONVERSATION_CHANNEL,
  POST_CONVERSATION_CHANNEL,
} from '../../../../shared/channels';

const conversationsAdapter = createEntityAdapter();

const initialState = conversationsAdapter.getInitialState({
  status: 'idle',
});

// thunk functions
export const fetchConversation = createAsyncThunk(
  'conversations/fetchConversation',
  async (query) => {
    const response = await IpcService.send<{ conversation: any }>(GET_CONVERSATION_CHANNEL, {
      params: { query },
    });

    // debugging
    console.debug(response);

    return response;
  },
);

export const fetchConversations = createAsyncThunk('conversations/fetchConversations', async () => {
  return await IpcService.send<{ conversations: any }>(GET_CONVERSATIONS_CHANNEL);
});

export const saveNewConversation = createAsyncThunk(
  'conversations/saveNewConversation',
  async ({ description, instructions }) => {
    const response = await IpcService.send<{ conversation: any }>(POST_CONVERSATION_CHANNEL, {
      params: {
        description,
        instructions,
      },
    });
    return response;
  },
);

export const deleteConversation = createAsyncThunk(
  'conversations/deleteConversation',
  async (id) => {
    const response = await IpcService.send<{ conversation: any }>(DELETE_CONVERSATION_CHANNEL, {
      params: { id },
    });
    console.debug(response);
    return id;
  },
);

const conversationsSlice = createSlice({
  name: 'conversations',
  initialState,
  reducers: {
    conversationDeleted: conversationsAdapter.removeOne,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        conversationsAdapter.setAll(state, action.payload);
        state.status = 'idle';
      })
      .addCase(saveNewConversation.fulfilled, (state, action) => {
        const conversation = action.payload;
        conversationsAdapter.addOne(state, conversation);
      })
      .addCase(deleteConversation.fulfilled, conversationsAdapter.removeOne);
  },
});

export const { conversationDeleted } = conversationsSlice.actions;

export default conversationsSlice.reducer;

export const { selectAll: selectConversations, selectById: selectConversationById } =
  conversationsAdapter.getSelectors((state) => state.conversations);

export const selectConversationIds = createSelector(
  // First, pass one or more "input selector" functions:
  selectConversations,
  // Then, an "output selector" that receives all the input results as arguments
  // and returns a final result value
  (conversations) => conversations.map((conversation) => conversation.id),
);
