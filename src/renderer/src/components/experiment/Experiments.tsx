import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';

import Button from '@mui/joy/Button';

import { selectCurrentUser } from '@renderer/components/user/UsersSlice';
import { AppDispatch } from '@renderer/store';

import ExperimentList from './ExperimentList.tsx';
import ExperimentTable from './ExperimentTable.tsx';
import { fetchExperiments } from './ExperimentsSlice';

export default function Experiments(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();
  const currentUser = useSelector(selectCurrentUser);

  useEffect(() => {
    if (currentUser) {
      dispatch(fetchExperiments({ email: currentUser }));
      dispatch(fetchExperiments({ email: currentUser })).catch((error) => {
        console.error('Failed to fetch experiments:', error);
      });
    }
  }, [dispatch, currentUser]);

  return (
    <div>
      <Button color="primary" to="/experiments/new" component={RouterLink}>
        {t('New Experiment')}
      </Button>
      <ExperimentTable />
      <ExperimentList />
    </div>
  );
}
