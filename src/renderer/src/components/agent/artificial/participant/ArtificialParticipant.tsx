import { ReactElement, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';

import log from 'electron-log/renderer';

import CustomBreadcrumbs from '../../../layout/CustomBreadcrumbs';
import { fetchAgent, selectAgentById } from '../../AgentsSlice';
import { Button } from '@mui/joy';

/**
 * Renders an Artificial Participant component that displays agent details.
 *
 * The component retrieves the agent identifier from the URL, dispatches an action to fetch
 * the associated agent information, and uses translation functions for localized text.
 * It conditionally renders either a localized "Agent Not Found" message when no agent is available
 * or a detailed view with breadcrumbs, a back button, and the agent's name and description.
 *
 * @returns The React element representing the agent details view.
 */
export default function ArtificialParticipant(): ReactElement {
  const { agentId } = useParams();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const query = { id: agentId };
    log.debug(`fetching artificial assistant ${agentId}`);
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
        <Button color="neutral" onClick={() => navigate(-1)}>
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
