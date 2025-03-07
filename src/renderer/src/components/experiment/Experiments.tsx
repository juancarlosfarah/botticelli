import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';

import Button from '@mui/joy/Button';

import ExperimentList from './ExperimentList.tsx';
import ExperimentTable from './ExperimentTable.tsx';
import { fetchExperiments } from './ExperimentsSlice';

export default function Experiments(): JSX.Element {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(fetchExperiments());
  }, []);

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
