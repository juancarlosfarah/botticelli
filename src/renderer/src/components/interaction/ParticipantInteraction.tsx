import { ReactElement, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink, useParams } from 'react-router-dom';

import CloseIcon from '@mui/icons-material/Close';
import { Button } from '@mui/joy';
import Box from '@mui/joy/Box';
import Link from '@mui/joy/Link';
import Typography from '@mui/joy/Typography';

import { AppDispatch, RootState } from '../../store';
import MessagesPane from '../Messages/MessagesPane';
import {
  fetchInteraction,
  selectInteractionById,
  selectInteractionStatusById,
  startInteraction,
} from './InteractionsSlice';

export default function ParticipantInteraction(): ReactElement | null {
  const { experimentId, participantId, interactionId } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();

  if (!experimentId || !participantId || !interactionId) {
    return <div>{t('Interaction Not Found')}</div>;
  }

  const interaction = useSelector((state: RootState) =>
    selectInteractionById(state, interactionId),
  );

  const status = useSelector((state: RootState) =>
    selectInteractionStatusById(state, interactionId),
  );

  useEffect(() => {
    dispatch(fetchInteraction({ id: interactionId }));
  }, [dispatch, interactionId]);

  if (!interaction) {
    if (status === 'failed') {
      return <div>{t('Interaction Not Found')}</div>;
    }
    return null;
  }
  const handleStartInteraction = (): void => {
    dispatch(startInteraction(interactionId));
  };

  if (!interaction.started) {
    return (
      <>
        <Link
          underline="none"
          color="neutral"
          aria-label={t('Back')}
          component={RouterLink}
          to={`/experiments/${experimentId}`}
          sx={{ position: 'fixed', top: '1rem', right: '1rem', zIndex: 10000 }}
        >
          <CloseIcon />
        </Link>
        <Box
          sx={{
            // height: { xs: 'calc(100dvh - var(--Header-height))', lg: '100dvh' },
            display: 'flex',
            flexDirection: 'column',
            textAlign: 'center',
          }}
        >
          {interaction.participantInstructions && (
            <Typography level="title-lg" sx={{ p: 10, textAlign: 'justify' }}>
              <ReactMarkdown>
                {interaction.participantInstructions}
              </ReactMarkdown>
            </Typography>
          )}
          <Button
            size="lg"
            sx={{ mt: 3, mx: 'auto' }}
            onClick={handleStartInteraction}
          >
            {t('Start')}
          </Button>
        </Box>
      </>
    );
  }

  return (
    <>
      <Link
        underline="none"
        color="neutral"
        aria-label={t('Back')}
        component={RouterLink}
        to={`/experiments/${experimentId}`}
        sx={{ position: 'fixed', top: '1rem', right: '1rem', zIndex: 10000 }}
      >
        <CloseIcon />
      </Link>
      {interaction.completed ? (
        <Box
          sx={{
            // height: { xs: 'calc(100dvh - var(--Header-height))', lg: '100dvh' },
            display: 'flex',
            flexDirection: 'column',
            textAlign: 'center',
          }}
        >
          <Typography level="title-lg">
            <ReactMarkdown>
              {interaction.participantInstructionsOnComplete}
            </ReactMarkdown>
          </Typography>
        </Box>
      ) : (
        <MessagesPane
          interactionId={interactionId}
          exchangeId={interaction.currentExchange}
          participantId={participantId}
          readOnly={false}
        />
      )}
    </>
  );
}
