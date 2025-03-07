import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';

import Button from '@mui/joy/Button';

import ExperimentList from './ExperimentList.tsx';
import ExperimentTable from './ExperimentTable.tsx';
import { fetchExperiments } from './ExperimentsSlice';

/**
 * Renders the experiments management view.
 *
 * This component dispatches an action to load experiment data when it mounts and displays a button to create a new experiment, along with an experiment table and list. The button label is internationalized.
 *
 * @returns A JSX element representing the experiments interface.
 */
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
