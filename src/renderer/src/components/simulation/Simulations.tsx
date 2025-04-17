import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';

import Button from '@mui/joy/Button';

import { selectCurrentUser } from '@renderer/components/user/UsersSlice';
import { AppDispatch } from '@renderer/store';

import SimulationList from './SimulationList.tsx';
import SimulationTable from './SimulationTable.tsx';
import { fetchSimulations } from './SimulationsSlice';

export default function Simulations(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();

  const { t } = useTranslation();
  const currentUser = useSelector(selectCurrentUser);

  useEffect(() => {
    if (currentUser) {
      dispatch(fetchSimulations({ email: currentUser }));
      dispatch(fetchSimulations({ email: currentUser })).catch((error) => {
        console.error('Failed to fetch simulations:', error);
      });
    }
  }, [dispatch, currentUser]);

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
