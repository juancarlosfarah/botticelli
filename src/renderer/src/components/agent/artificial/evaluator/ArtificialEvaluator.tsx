import { ReactElement, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { Button } from '@mui/joy';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';

import log from 'electron-log/renderer';

import CustomBreadcrumbs from '../../../layout/CustomBreadcrumbs';
import { fetchAgent, selectAgentById } from '../../AgentsSlice';

/**
 * Renders the Artificial Evaluator component.
 *
 * The component reads the agent ID from the URL parameters, dispatches a Redux action to fetch the agent's data,
 * and selects the agent from the store. If no agent is found, it displays a localized "Agent Not Found" message.
 * Otherwise, it renders breadcrumbs, a back button for navigation, and displays the agent's name and description
 * using localized labels.
 */
export default function ArtificialEvaluator(): ReactElement {
  const { agentId } = useParams();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const query = { id: agentId };
    log.debug(`fetching agent ${agentId}`);
    dispatch(fetchAgent(query));
  }, [agentId]);

  const agent = useSelector((state) => selectAgentById(state, agentId));

  if (!agent) {
    return <div>{t('Agent Not Found')}</div>;
  }

  return (
    <>
      <CustomBreadcrumbs />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          my: 1,
          gap: 1,
        }}
      >
        <Button
          color="neutral"
          onClick={() => navigate(`/agents/artificial/evaluators`)}
        >
          {t('Back')}
        </Button>
        <Typography level="h2">Agent</Typography>
      </Box>
      <Typography sx={{}} level="title-md">
        {t('Name')}
      </Typography>
      <Typography>{agent.name}</Typography>
      <Typography sx={{ mt: 1 }} level="title-md">
        Description
      </Typography>
      <Typography>{agent.description}</Typography>
    </>
  );
}
