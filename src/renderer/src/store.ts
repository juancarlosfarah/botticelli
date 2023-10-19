import { configureStore } from '@reduxjs/toolkit';

import conversationsReducer from './components/Conversations/ConversationsSlice';

const store = configureStore({
  reducer: {
    // define a top-level state field named `key`, handled by `value`
    conversations: conversationsReducer,
  },
});

export default store;
