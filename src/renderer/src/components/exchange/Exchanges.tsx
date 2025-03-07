import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import ExchangeTable from './ExchangeTable.tsx';
import { fetchExchanges } from './ExchangesSlice';

export default function Exchanges(): JSX.Element {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchExchanges());
  }, []);

  return (
    <div>
      <ExchangeTable />
    </div>
  );
}
