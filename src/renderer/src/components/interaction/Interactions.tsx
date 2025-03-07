import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';

import Button from '@mui/joy/Button';

import InteractionList from './InteractionList.tsx';
import InteractionTable from './InteractionTable.tsx';
import { fetchInteractions } from './InteractionsSlice';

/**
 * Renders the Interactions component.
 *
 * This component fetches interaction data when mounted and displays a user interface for managing interactions.
 * It includes a button that navigates to the creation page for a new interaction (with the label translated using i18next),
 * along with both a table and a list view to present the fetched interactions.
 *
 * @returns The JSX element representing the interactions interface.
 */
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
