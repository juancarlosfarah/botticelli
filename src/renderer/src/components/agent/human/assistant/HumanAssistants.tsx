import { ReactElement, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';

import Button from '@mui/joy/Button';

import { fetchAgents } from '../../AgentsSlice';
import HumanAssistantTable from './HumanAssistantTable';

/**
 * Renders the Human Assistants page.
 *
 * This component dispatches an action to fetch agent data upon mounting and displays a button (with internationalized label) that navigates to the form for creating a new human assistant, as well as a table of existing assistants.
 *
 * @returns A React element representing the Human Assistants view.
 */
export default function HumanAssistants(): ReactElement {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(fetchAgents());
  }, []);
  return (
    <div>
      <Button
        color="primary"
        to="/agents/human/assistants/new"
        component={RouterLink}
      >
        {t('New Human Assistant')}
      </Button>
      <HumanAssistantTable />
    </div>
  );
}
