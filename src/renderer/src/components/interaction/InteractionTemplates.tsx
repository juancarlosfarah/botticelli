import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';

import Button from '@mui/joy/Button';

import InteractionTemplateList from './InteractionTemplateList.tsx';
import InteractionTemplateTable from './InteractionTemplateTable.tsx';
import { fetchInteractionTemplates } from './InteractionTemplatesSlice';

/**
 * Renders a component that fetches and displays interaction templates.
 *
 * On mount, the component dispatches an action to fetch interaction templates and uses translation for UI text.
 * It renders a button that navigates to a form for creating a new interaction template,
 * along with both a table and a list to display the fetched templates.
 */
export default function InteractionTemplates(): JSX.Element {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(fetchInteractionTemplates());
  }, []);

  return (
    <div>
      <Button
        color="primary"
        to="/interactions/templates/new"
        component={RouterLink}
      >
        {t('New Interaction Template')}
      </Button>
      <InteractionTemplateTable />
      <InteractionTemplateList />
    </div>
  );
}
