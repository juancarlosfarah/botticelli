import { ReactElement, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';

import Button from '@mui/joy/Button';

import { fetchAgents } from '../../AgentsSlice';
import ArtificialParticipantTable from './ArtificialParticipantTable';

/**
 * Renders the interface for managing artificial participants.
 *
 * Upon mounting, the component dispatches an action to fetch agent data. It displays a button, whose label is translated for internationalization, that navigates to the form for creating a new artificial participant, along with a table of existing participants.
 *
 * @returns A React element representing the artificial participants interface.
 */
export default function ArtificialParticipants(): ReactElement {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(fetchAgents());
  }, []);
  return (
    <div>
      <Button
        color="primary"
        to="/agents/artificial/participants/new"
        component={RouterLink}
      >
        {t('New Artificial Participant')}
      </Button>
      <ArtificialParticipantTable />
    </div>
  );
}
