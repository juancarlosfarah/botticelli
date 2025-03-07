import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';

import Button from '@mui/joy/Button';

import TriggerList from './TriggerList.tsx';
import TriggerTable from './TriggerTable.tsx';
import { fetchTriggers } from './TriggersSlice';

/**
 * Renders the Triggers component that fetches and displays trigger data.
 *
 * When the component mounts, it dispatches an action to load trigger data. It renders a
 * primary button that navigates to the new trigger creation page using a translated label,
 * along with both a table view and a list view for presenting triggers.
 *
 * @returns The rendered Triggers component.
 */
export default function Triggers(): JSX.Element {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(fetchTriggers());
  }, []);

  return (
    <div>
      <Button color="primary" to="/triggers/new" component={RouterLink}>
        {t('New Trigger')}
      </Button>
      <TriggerTable />
      <TriggerList />
    </div>
  );
}
