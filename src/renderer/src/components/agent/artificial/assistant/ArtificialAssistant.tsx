import { ReactElement, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';

import log from 'electron-log/renderer';

import CustomBreadcrumbs from '../../../layout/CustomBreadcrumbs';
import { fetchAgent, selectAgentById } from '../../AgentsSlice';

export default function ArtificialAssistant(): ReactElement {
  const { agentId } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    const query = { id: agentId };
    log.debug(`fetching agent ${agentId}`);
    dispatch(fetchAgent(query));
  }, [agentId]);

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
      <Typography sx={{ mt: 1 }} level="title-md">
        Avatar Url
      </Typography>
      <Typography>{agent.avatarUrl}</Typography>
      <Typography sx={{ mt: 1 }} level="title-md">
        Social Cues
      </Typography>
      <List component="ol" marker="decimal">
        {socialCues.length > 0 ? (
          socialCues.map((cue) => (
            <ListItem key={cue.id}>
              <Typography level="body-md">{cue.name}: {cue.description}</Typography>
            </ListItem>
          ))
        ) : (
          <ListItem>
            <Typography level="body-md">No social cues available</Typography>
          </ListItem>
        )}
      </List>
      <Typography sx={{ mt: 1 }} level="title-md">
        Description
      </Typography>
      <Typography>{agent.description}</Typography>
    </>
  );
  
}
