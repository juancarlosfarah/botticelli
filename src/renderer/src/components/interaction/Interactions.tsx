import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';

import Button from '@mui/joy/Button';

import InteractionList from './InteractionList.tsx';
import InteractionTable from './InteractionTable.tsx';
import { fetchInteractions } from './InteractionsSlice';

export default function Interactions(): JSX.Element {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(fetchInteractions());
  }, []);

  return (
    <div>
      <Button color="primary" to="/interactions/new" component={RouterLink}>
        {t('New Interaction')}
      </Button>
      <InteractionTable />
      <InteractionList />
    </div>
  );
}
