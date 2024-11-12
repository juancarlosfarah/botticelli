import { ReactElement, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink, useParams } from 'react-router-dom';

import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import Link from '@mui/joy/Link';

import log from 'electron-log/renderer';

import CustomBreadcrumbs from '../../../layout/CustomBreadcrumbs';
import { fetchAgent, selectAgentById } from '../../AgentsSlice';

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase();
}

export default function ArtificialAssistant(): ReactElement {
  const { agentId } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    if (agentId) {
      const query = { id: agentId };
      log.debug(`fetching agent ${agentId}`);
      dispatch(fetchAgent(query));
    }
  }, [agentId, dispatch]);

  const agent = useSelector((state) => selectAgentById(state, agentId));
  const socialCues = agent?.socialCues || [];

  if (!agent) {
    return <div>Agent Not Found</div>;
  }

  return (
    <>
      <CustomBreadcrumbs />
      <Box
        sx={{
          display: 'flex',
          my: 1,
          gap: 1,
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'start', sm: 'center' },
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        }}
      >
        <Typography level="h2">Agent</Typography>
      </Box>

      <Typography sx={{}} level="title-md">
        Name
      </Typography>
      <Typography>{agent.name}</Typography>
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            backgroundColor: 'grey.400',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mt: 1,
          }}
        >
          <Typography level="h4" sx={{ color: 'white' }}>
            {getInitials(agent.name)}
          </Typography>
        </Box>
      <Typography sx={{ mt: 1 }} level="title-md">
        Description
      </Typography>
      <Typography>{agent.description}</Typography>

      <Typography sx={{ mt: 1 }} level="title-md">
        Social Cues
      </Typography>

      <List component="ol" marker="decimal">
        {socialCues.length > 0 ? (
          socialCues.map((cue) => (
            <ListItem key={cue.id}>
              <Typography level="body-md">
                <Link
                  level="body-md"
                  component={RouterLink}
                  to={`/socialcues/${cue.id}`}
                >
                  {cue.name}
                </Link>
                : {cue.description}
              </Typography>
            </ListItem>
          ))
        ) : (
          <ListItem>
            <Typography level="body-md">No social cues available.</Typography>
          </ListItem>
        )}
      </List>
    </>
  );
}
