import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';

import Button from '@mui/joy/Button';

import { selectCurrentUser } from '@renderer/components/user/UsersSlice';
import { AppDispatch } from '@renderer/store.ts';

import InteractionList from './InteractionList.tsx';
import InteractionTable from './InteractionTable.tsx';
import { fetchInteractions } from './InteractionsSlice';

export default function Interactions(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();

  const currentUser = useSelector(selectCurrentUser);

  useEffect(() => {
    if (currentUser) {
      dispatch(fetchInteractions({ email: currentUser }));
    }
  }, [dispatch, currentUser]);
  return (
    <div>
      <Button color="primary" to="/interactions/new" component={RouterLink}>
        {t('New Interaction')}
      </Button>
      <InteractionTable />
      <InteractionList />
    </div>
  );
}
