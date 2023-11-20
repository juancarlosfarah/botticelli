import { configureStore } from '@reduxjs/toolkit';

import conversationsReducer from './components/Conversations/ConversationsSlice';
import messagesReducer from './components/Messages/MessagesSlice';
import agentsReducer from './components/agent/AgentsSlice';

const store = configureStore({
  reducer: {
    // define a top-level state field named `key`, handled by `value`
    conversations: conversationsReducer,
    messages: messagesReducer,
    agents: agentsReducer,
  },
});

export default store;
