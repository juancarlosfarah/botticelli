import { configureStore } from '@reduxjs/toolkit';

import agentsReducer from './components/Agents/AgentsSlice';
import conversationsReducer from './components/Conversations/ConversationsSlice';
import messagesReducer from './components/Messages/MessagesSlice';

const store = configureStore({
  reducer: {
    // define a top-level state field named `key`, handled by `value`
    conversations: conversationsReducer,
    messages: messagesReducer,
    agents: agentsReducer,
  },
});

export default store;
