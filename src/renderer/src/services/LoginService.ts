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

  //fetch new user data
  try {
    console.debug('Fetching triggers...');
    await dispatch(fetchTriggers({ email })).unwrap();

    console.debug('Fetching agents...');
    await dispatch(fetchAgents({ email })).unwrap();

    console.debug('Fetching experiments...');
    await dispatch(fetchExperiments({ email })).unwrap();

    console.debug('Fetching simulations...');
    await dispatch(fetchSimulations({ email })).unwrap();

    console.debug('Fetching interactions...');
    await dispatch(fetchInteractions({ email })).unwrap();

    console.debug('Fetching interaction templates...');
    await dispatch(fetchInteractionTemplates({ email })).unwrap();

    console.debug('Fetching exchanges...');
    await dispatch(fetchExchanges({ email })).unwrap();

    console.debug('Fetching exchange templates...');
    await dispatch(fetchExchangeTemplates({ email })).unwrap();
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
}
