import { ReactElement, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';

import Button from '@mui/joy/Button';

import { fetchAgents } from '../../AgentsSlice';
import ArtificialAssistantTable from './ArtificialAssistantTable';

/**
 * Renders the Artificial Assistants component.
 *
 * On mount, it dispatches an action to fetch agent data. The component displays a primary button—whose label is translated based on the user's locale—that links to the page for creating a new artificial assistant, and it renders a table listing the existing artificial assistants.
 *
 * @returns The rendered JSX element for the Artificial Assistants component.
 */
export default function ArtificialAssistants(): ReactElement {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(fetchAgents());
  }, []);
  return (
    <div>
      <Button
        color="primary"
        to="/agents/artificial/assistants/new"
        component={RouterLink}
      >
        {t('New Artificial Assistant')}
      </Button>
      <ArtificialAssistantTable />
    </div>
  );
}
