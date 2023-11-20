import { ReactElement, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';

import Button from '@mui/joy/Button';

import { fetchAgents } from '../../AgentsSlice';
import ArtificialParticipantTable from './ArtificialParticipantTable';

export default function ArtificialParticipants(): ReactElement {
  const dispatch = useDispatch();

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
        New Artificial Participant
      </Button>
      <ArtificialParticipantTable />
    </div>
  );
}
