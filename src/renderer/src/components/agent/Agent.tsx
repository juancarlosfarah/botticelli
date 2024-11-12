import { ReactElement, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link as RouterLink } from 'react-router-dom';

import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import Avatar from '@mui/joy/Avatar';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import Link from '@mui/joy/Link';

import log from 'electron-log/renderer';

import CustomBreadcrumbs from '../layout/CustomBreadcrumbs';
import { fetchAgent, selectAgentById } from './AgentsSlice';

export default function Agent(): ReactElement {
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

  // Log the avatar URL for debugging purposes
  console.log("Agent Avatar URL:", agent.avatarUrl);

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
        <Avatar
          src={agent.avatarUrl || undefined}
          alt={agent.name}
          sx={{ width: 60, height: 60, fontSize: '1.5rem', mt: 1 }}
        />
      </Box>
      <Typography level="title-md">Name</Typography>
      <Typography>{agent.name}</Typography>
      
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
