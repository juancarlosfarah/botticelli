import { ReactElement, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';

import Button from '@mui/joy/Button';

import { fetchAgents } from '../../AgentsSlice';
import HumanParticipantTable from './HumanParticipantTable';

/**
 * Renders the human participants view.
 *
 * On mount, the component dispatches an action to fetch agent data. It displays a table of human participants and a button that, when clicked, navigates to the creation form for a new human participant. The button label is localized based on the current language setting.
 *
 * @returns A React element containing the user interface for managing human participants.
 */
export default function HumanParticipants(): ReactElement {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(fetchAgents());
  }, []);
  return (
    <div>
      <Button
        color="primary"
        to="/agents/human/participants/new"
        component={RouterLink}
      >
        {t('New Human Participant')}
      </Button>
      <HumanParticipantTable />
    </div>
  );
}
