import {
  agentsCleared,
  fetchAgents,
} from '@renderer/components/agent/AgentsSlice';
import {
  exchangeTemplatesCleared,
  fetchExchangeTemplates,
} from '@renderer/components/exchange/ExchangeTemplatesSlice';
import {
  exchangesCleared,
  fetchExchanges,
} from '@renderer/components/exchange/ExchangesSlice';
import {
  experimentsCleared,
  fetchExperiments,
} from '@renderer/components/experiment/ExperimentsSlice';
import {
  fetchInteractionTemplates,
  interactionsTemplateCleared,
} from '@renderer/components/interaction/InteractionTemplatesSlice';
import {
  fetchInteractions,
  interactionsCleared,
} from '@renderer/components/interaction/InteractionsSlice';
import {
  fetchSimulations,
  simulationsCleared,
} from '@renderer/components/simulation/SimulationsSlice';

import {
  fetchTriggers,
  triggersCleared,
} from '../components/trigger/TriggersSlice';
import { setCurrentUser } from '../components/user/UsersSlice';
import { AppDispatch } from '../store';

export async function onLoginSuccess(
  dispatch: AppDispatch,
  email: string,
): Promise<void> {
  dispatch(setCurrentUser(email));

  // previous user data
  dispatch(triggersCleared());
  dispatch(agentsCleared());
  dispatch(experimentsCleared());
  dispatch(simulationsCleared());
  dispatch(interactionsCleared());
  dispatch(interactionsTemplateCleared());
  dispatch(exchangesCleared());
  dispatch(exchangeTemplatesCleared());

  // fetch new user data
  await dispatch(fetchTriggers({ email }));
  await dispatch(fetchAgents({ email }));
  await dispatch(fetchExperiments({ email }));
  await dispatch(fetchSimulations({ email }));
  await dispatch(fetchInteractions({ email }));
  await dispatch(fetchInteractionTemplates({ email }));
  await dispatch(fetchExchanges({ email }));
  await dispatch(fetchExchangeTemplates({ email }));
}
