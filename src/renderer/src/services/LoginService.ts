import {
  agentsCleared,
  fetchAgents,
} from '@renderer/components/agent/AgentsSlice';
import {
  experimentsCleared,
  fetchExperiments,
} from '@renderer/components/experiment/ExperimentsSlice';
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

  // fetch new user data
  await dispatch(fetchTriggers({ email }));
  await dispatch(fetchAgents({ email }));
  await dispatch(fetchExperiments({ email }));
  await dispatch(fetchSimulations({ email }));
}
