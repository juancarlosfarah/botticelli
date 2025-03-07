import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';

import Button from '@mui/joy/Button';

import { AppDispatch } from '../../store';
import SimulationList from './SimulationList.tsx';
import SimulationTable from './SimulationTable.tsx';
import { fetchSimulations } from './SimulationsSlice';

/**
 * Renders the Simulations component.
 *
 * This component fetches simulation data when mounted and displays it using both table and list formats.
 * It also provides a navigation button with an internationalized label for creating a new simulation.
 *
 * @returns A JSX element containing the simulations interface.
 */
export default function Simulations(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(fetchSimulations());
  }, []);

  return (
    <div>
      <Button color="primary" to="/simulations/new" component={RouterLink}>
        {t('New Simulation')}
      </Button>
      <SimulationTable />
      <SimulationList />
    </div>
  );
}
