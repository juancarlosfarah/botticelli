import { ReactElement, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink, useParams } from 'react-router-dom';

import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/joy/Box';
import Link from '@mui/joy/Link';
import Typography from '@mui/joy/Typography';

import log from 'electron-log/renderer';

import MessagesPane from '../Messages/MessagesPane';
import { fetchInteraction, selectInteractionById } from './InteractionsSlice';

export default function ParticipantInteraction(): ReactElement {
  const { experimentId, participantId, interactionId } = useParams();
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
      <Link
        underline="none"
        color="neutral"
        aria-label="Back"
        component={RouterLink}
        to={`/experiments/${experimentId}`}
        sx={{ position: 'fixed', top: '1rem', right: '1rem' }}
      >
        <CloseIcon />
      </Link>
      {interaction.completed ? (
        <Box
          sx={{
            height: { xs: 'calc(100dvh - var(--Header-height))', lg: '100dvh' },
            display: 'flex',
            flexDirection: 'column',
            textAlign: 'center',
          }}
        >
          <Typography level="title-lg">
            Merci pour votre participation.
          </Typography>
        </Box>
      ) : (
        <MessagesPane
          interactionId={interactionId}
          exchangeId={interaction.currentExchange}
          participantId={participantId}
        />
      )}
    </>
  );
}
