import { ReactElement, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';

import Button from '@mui/joy/Button';

import { fetchAgents } from '../../AgentsSlice';
import HumanParticipantTable from './HumanParticipantTable';

export default function HumanParticipants(): ReactElement {
  const dispatch = useDispatch();

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
        New Human Participant
      </Button>
      <HumanParticipantTable />
    </div>
  );
}
