import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';

import Button from '@mui/joy/Button';

import { AppDispatch } from '../../store.ts';
import SimulationList from './SocialCuesList.tsx';
import SimulationTable from './SocialCueTable.tsx';
import { fetchSimulations } from './SocialCuesSlice.ts';

export default function Simulations(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchSimulations());
  }, []);

  return (
    <div>
      <Button color="primary" to="/socialcues
      /new" component={RouterLink}>
        New Simulation
      </Button>
      <SimulationTable />
      <SimulationList />
    </div>
  );
}
