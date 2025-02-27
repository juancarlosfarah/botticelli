import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';

import Button from '@mui/joy/Button';

import TriggerList from './TriggerList.tsx';
import TriggerTable from './TriggerTable.tsx';
import { fetchTriggers } from './TriggersSlice';

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
