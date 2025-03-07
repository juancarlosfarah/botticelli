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
 * Renders the HumanAssistant view.
 *
 * This component retrieves the agent ID from the URL parameters and dispatches an action to fetch the agent's data.
 * It uses Redux to manage state and react-i18next for localizing user-facing text.
 * If the agent is found, the component displays its name and description along with navigational breadcrumbs and a back button.
 * Otherwise, it renders a localized "Agent Not Found" message.
 *
 * @returns A React element representing the agent details interface.
 */
export default function HumanAssistant(): ReactElement {
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
