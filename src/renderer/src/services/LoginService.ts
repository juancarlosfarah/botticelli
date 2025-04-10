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

  // fetch new user data
  await dispatch(fetchTriggers({ email }));
}
