import { ReactElement, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink, useParams } from 'react-router-dom';

import Box from '@mui/joy/Box';
import Link from '@mui/joy/Link';
import Typography from '@mui/joy/Typography';

import log from 'electron-log/renderer';
import capitalize from 'lodash.capitalize';

import { AppDispatch, RootState } from '../../store';
import MessagesPane from '../Messages/MessagesPane';
import { fetchMessages } from '../Messages/MessagesSlice';
import CustomBreadcrumbs from '../layout/CustomBreadcrumbs';
import { fetchExchange, selectExchangeById } from './ExchangesSlice';

export default function Exchange(): ReactElement {
  const { exchangeId } = useParams();
  const dispatch = useDispatch<AppDispatch>();

  if (!exchangeId) {
    return <div>Invalid Exchange ID</div>;
  }

  useEffect(() => {
    log.debug(`fetching exchange ${exchangeId}`);
    const query = { id: exchangeId };
    dispatch(fetchExchange(query));
    dispatch(fetchMessages({ exchangeId }));
  }, [exchangeId]);

  const exchange = useSelector((state: RootState) =>
    selectExchangeById(state, exchangeId),
  );

  if (!exchange) {
    return <div>Exchange Not Found</div>;
  }

  // show first trigger only if triggers exist
  const trigger = exchange?.triggers?.length ? exchange.triggers[0] : null;

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
        <Typography level="h2">Exchange</Typography>
      </Box>

      <Typography sx={{}} level="title-md">
        Name
      </Typography>
      <Typography>{exchange.name}</Typography>

      <Typography sx={{ mt: 1 }} level="title-md">
        Description
      </Typography>
      <Typography>{exchange.description}</Typography>

      <Typography sx={{ mt: 1 }} level="title-md">
        Instructions
      </Typography>
      <Typography>{exchange.instructions}</Typography>

      <Typography sx={{ mt: 1 }} level="title-md">
        Assistant
      </Typography>
      <Typography>{exchange?.assistant?.name || '—'}</Typography>

      <Typography sx={{ mt: 1 }} level="title-md">
        Participant
      </Typography>
      <Typography>{exchange?.interaction?.participant?.name || '—'}</Typography>

      <Typography sx={{ mt: 1 }} level="title-md">
        Interaction
      </Typography>
      <Typography>
        {exchange?.interaction ? (
          <Link
            level="body-md"
            component={RouterLink}
            to={`/interactions/${exchange.interaction.id}`}
          >
            {exchange.interaction.name}
          </Link>
        ) : (
          '—'
        )}
      </Typography>

      <Typography sx={{ mt: 1 }} level="title-md">
        Order
      </Typography>
      <Typography>{exchange?.order ?? '—'}</Typography>

      <Typography sx={{ mt: 1 }} level="title-md">
        Type
      </Typography>
      <Typography>{capitalize(exchange.inputType)}</Typography>

      <Typography sx={{ mt: 1 }} level="title-md">
        Trigger
      </Typography>
      <Typography>{trigger?.name || '—'}</Typography>

      <Typography sx={{ mt: 1 }} level="title-md">
        Soft Limit
      </Typography>
      <Typography>{exchange?.softLimit || '—'}</Typography>

      <Typography sx={{ mt: 1 }} level="title-md">
        Hard Limit
      </Typography>
      <Typography>{exchange?.hardLimit || '—'}</Typography>

      <MessagesPane
        exchangeId={exchange.id}
        interactionId={exchange?.interaction?.id}
        participantId={exchange?.interaction?.participant.id}
        readOnly
      />
    </>
  );
}
