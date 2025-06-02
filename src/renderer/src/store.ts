import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import { Persistor } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import audiosReducer from './components/Messages/AudiosSlice';
import messagesReducer from './components/Messages/MessagesSlice';
import agentsReducer from './components/agent/AgentsSlice';
import exchangeTemplatesReducer from './components/exchange/ExchangeTemplatesSlice';
import exchangesReducer from './components/exchange/ExchangesSlice';
import experimentsReducer from './components/experiment/ExperimentsSlice';
import interactionTemplatesReducer from './components/interaction/InteractionTemplatesSlice';
import interactionsReducer from './components/interaction/InteractionsSlice';
import settingsReducer from './components/settings/SettingsSlice';
import simulationsReducer from './components/simulation/SimulationsSlice';
import triggersReducer from './components/trigger/TriggersSlice';
import userReducer from './components/user/UsersSlice';

// Per-slice persistence config for user
const userPersistConfig = {
  key: 'user',
  storage,
  whitelist: ['currentUser'],
};

const rootReducer = combineReducers({
  exchanges: exchangesReducer,
  exchangeTemplates: exchangeTemplatesReducer,
  messages: messagesReducer,
  agents: agentsReducer,
  triggers: triggersReducer,
  interactions: interactionsReducer,
  interactionTemplates: interactionTemplatesReducer,
  experiments: experimentsReducer,
  simulations: simulationsReducer,
  audios: audiosReducer,
  settings: settingsReducer,
  user: persistReducer(userPersistConfig, userReducer),
});

//Root-level persist config
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['settings'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// define a top-level state field named `key`, handled by `value`

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor: Persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
