import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import Conversation from '@shared/interfaces/Conversation';
import log from 'electron-log/renderer';

import {
  DELETE_CONVERSATION_CHANNEL,
  GET_CONVERSATIONS_CHANNEL,
  GET_CONVERSATION_CHANNEL,
  POST_CONVERSATION_CHANNEL,
} from '../../../../shared/channels';
import Agent from '../../../../shared/interfaces/Agent';
import { IpcService } from '../../services/IpcService';

const conversationsAdapter = createEntityAdapter();

const initialState = conversationsAdapter.getInitialState({
  status: 'idle',
});

// thunk functions
export const fetchConversation = createAsyncThunk(
  'conversations/fetchConversation',
  async (query) => {
    const response = await IpcService.send<{ conversation: any }>(
      GET_CONVERSATION_CHANNEL,
      {
        params: { query },
      },
    );

    // debugging
    log.debug(`fetchConversation response:`, response);

    return response;
  },
);

export const fetchConversations = createAsyncThunk(
  'conversations/fetchConversations',
  async () => {
    return await IpcService.send<{ conversations: any }>(
      GET_CONVERSATIONS_CHANNEL,
    );
  },
);

export const saveNewConversation = createAsyncThunk<
  Conversation,
  {
    description: string;
    instructions: string;
    assistant: Agent;
    participant: Agent;
    triggers: number;
  }
>(
  'conversations/saveNewConversation',
  async ({ description, instructions, assistant, participant, triggers }) => {
    const response = await IpcService.send<{ conversation: any }>(
      POST_CONVERSATION_CHANNEL,
      {
        params: {
          description,
          instructions,
          assistant,
          participant,
          triggers,
        },
      },
    );
    return response;
  },
);

export const deleteConversation = createAsyncThunk<
  string | number,
  string | number
>('conversations/deleteConversation', async (id) => {
  const response = await IpcService.send<{ conversation: any }>(
    DELETE_CONVERSATION_CHANNEL,
    {
      params: { id },
    },
  );
  log.debug(response);
  return id;
});

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
      .addCase(fetchConversation.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchConversation.fulfilled, (state, action) => {
        const conversation = action.payload;
        conversationsAdapter.setOne(state, conversation);
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

export const {
  selectAll: selectConversations,
  selectById: selectConversationById,
} = conversationsAdapter.getSelectors((state) => state.conversations);

export const selectConversationIds = createSelector(
  // First, pass one or more "input selector" functions:
  selectConversations,
  // Then, an "output selector" that receives all the input results as arguments
  // and returns a final result value
  (conversations) => conversations.map((conversation) => conversation.id),
);
