import { configureStore } from '@reduxjs/toolkit';

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

const store = configureStore({
  reducer: {
    // define a top-level state field named `key`, handled by `value`
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
    user: userReducer,
  },
});

// infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
