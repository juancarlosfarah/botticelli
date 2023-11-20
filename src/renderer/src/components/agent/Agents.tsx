import { ReactElement, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';

import Button from '@mui/joy/Button';

import AgentTable from './AgentTable';
import { fetchAgents } from './AgentsSlice';

export default function Agents(): ReactElement {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAgents());
  }, []);
  return (
    <div>
      <Button color="primary" to="/agents/new" component={RouterLink}>
        New Agent
      </Button>
      <AgentTable />
    </div>
  );
}
