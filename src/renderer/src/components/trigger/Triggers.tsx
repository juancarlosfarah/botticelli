import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';

import Button from '@mui/joy/Button';

import TriggerList from './TriggerList.tsx';
import TriggerTable from './TriggerTable.tsx';
import { fetchTriggers } from './TriggersSlice';

export default function Triggers(): JSX.Element {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTriggers());
  }, []);

  return (
    <div>
      <Button color="primary" to="/triggers/new" component={RouterLink}>
        New Trigger
      </Button>
      <TriggerTable />
      <TriggerList />
    </div>
  );
}
