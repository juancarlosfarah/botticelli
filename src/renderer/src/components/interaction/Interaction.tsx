import { ReactElement, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink, useParams } from 'react-router-dom';

import Box from '@mui/joy/Box';
import Link from '@mui/joy/Link';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import Typography from '@mui/joy/Typography';

import log from 'electron-log/renderer';

import CustomBreadcrumbs from '../layout/CustomBreadcrumbs';
import { fetchInteraction, selectInteractionById } from './InteractionsSlice';

export default function Interaction(): ReactElement {
  const { interactionId } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    const query = { id: interactionId };
    log.debug(`fetching interaction ${interactionId}`);
    dispatch(fetchInteraction(query));
  }, [interactionId]);

  const interaction = useSelector((state) =>
    selectInteractionById(state, interactionId),
  );

  if (!interaction) {
    return <div>Interaction Not Found</div>;
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
        <Typography level="h2">Interaction</Typography>
      </Box>
      <Typography sx={{}} level="title-md">
        Name
      </Typography>
      <Typography>{interaction.name}</Typography>

      <Typography sx={{ mt: 1 }} level="title-md">
        Description
      </Typography>
      <Typography>{interaction.description}</Typography>

      <Typography sx={{ mt: 1 }} level="title-md">
        Instructions
      </Typography>
      <Typography>{interaction.instructions}</Typography>

      <Typography sx={{ mt: 1 }} level="title-md">
        Experiment
      </Typography>
      <Typography>
        {interaction?.experiment ? (
          <Link
            level="body-md"
            component={RouterLink}
            to={`/experiments/${interaction?.experiment.id}`}
          >
            {interaction?.experiment.name}
          </Link>
        ) : (
          '—'
        )}
      </Typography>

      <Typography sx={{ mt: 1 }} level="title-md">
        Exchanges
      </Typography>
      <List component="ol" marker="decimal">
        {interaction?.exchanges?.map((exchange) => {
          return (
            <ListItem key={exchange.id}>
              <Link
                level="body-md"
                component={RouterLink}
                to={`/exchanges/${exchange.id}`}
              >
                {exchange.name}
              </Link>
            </ListItem>
          );
        }) || '—'}
      </List>
    </>
  );
}
