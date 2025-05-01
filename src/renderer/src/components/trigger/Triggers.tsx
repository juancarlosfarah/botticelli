import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';

import Button from '@mui/joy/Button';

import { AppDispatch } from '@renderer/store.ts';

import { selectCurrentUser } from '../user/UsersSlice.ts';
import TriggerList from './TriggerList.tsx';
import TriggerTable from './TriggerTable.tsx';
import { fetchTriggers } from './TriggersSlice';

export default function Triggers(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();
  const currentUser = useSelector(selectCurrentUser);

  useEffect(() => {
    if (currentUser) {
      dispatch(fetchTriggers({ email: currentUser }));
      dispatch(fetchTriggers({ email: currentUser })).catch((error) => {
        console.error('Failed to fetch triggers:', error);
      });
    }
  }, [dispatch, currentUser]);

  return (
    <div>
      <Button color="primary" to="/triggers/new" component={RouterLink}>
        {t('New Trigger')}
      </Button>
      <TriggerTable />
      <TriggerList />
    </div>
  );
}
