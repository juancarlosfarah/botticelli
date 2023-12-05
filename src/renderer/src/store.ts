import { configureStore } from '@reduxjs/toolkit';

import conversationsReducer from './components/Conversations/ConversationsSlice';
import messagesReducer from './components/Messages/MessagesSlice';
import agentsReducer from './components/agent/AgentsSlice';
import experimentsReducer from './components/experiment/ExperimentsSlice';
import interactionsReducer from './components/interaction/InteractionsSlice';
import triggersReducer from './components/trigger/TriggersSlice';

const store = configureStore({
  reducer: {
    // define a top-level state field named `key`, handled by `value`
    conversations: conversationsReducer,
    messages: messagesReducer,
    agents: agentsReducer,
    triggers: triggersReducer,
    interactions: interactionsReducer,
    experiments: experimentsReducer,
  },
});

export default store;
