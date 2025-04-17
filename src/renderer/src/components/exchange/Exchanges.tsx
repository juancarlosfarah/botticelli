import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AppDispatch } from '@renderer/store.ts';

import { selectCurrentUser } from '../user/UsersSlice';
import ExchangeTable from './ExchangeTable.tsx';
import { fetchExchanges } from './ExchangesSlice';

export default function Exchanges(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const currentUser = useSelector(selectCurrentUser);

  useEffect(() => {
    if (currentUser) {
      dispatch(fetchExchanges({ email: currentUser }));
      dispatch(fetchExchanges({ email: currentUser })).catch((error) => {
        console.error('Failed to fetch exchanges:', error);
      });
    }
  }, [dispatch, currentUser]);

  return (
    <div>
      <ExchangeTable />
    </div>
  );
}
