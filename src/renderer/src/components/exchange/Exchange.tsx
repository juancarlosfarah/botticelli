import { ReactElement, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';

import log from 'electron-log/renderer';

import MessagesPane from '../Messages/MessagesPane';
import { fetchMessages } from '../Messages/MessagesSlice';
import CustomBreadcrumbs from '../layout/CustomBreadcrumbs';
import { fetchExchange, selectExchangeById } from './ExchangesSlice';

export default function Exchange(): ReactElement {
  const { exchangeId } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    const query = { id: exchangeId };
    log.debug(`fetching exchange ${exchangeId}`);
    dispatch(fetchExchange(query));
    dispatch(fetchMessages({ exchangeId }));
  }, [exchangeId]);

  const exchange = useSelector((state) =>
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
      <Typography>{exchange?.participant?.name || '—'}</Typography>
      <Typography sx={{ mt: 1 }} level="title-md">
        Trigger
      </Typography>
      <Typography>{trigger?.name || '—'}</Typography>
      <MessagesPane exchange={exchange} />
    </>
  );
}
