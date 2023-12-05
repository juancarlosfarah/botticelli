import { ReactElement, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';

import log from 'electron-log/renderer';

import CustomBreadcrumbs from '../layout/CustomBreadcrumbs';
import {
  fetchExchangeTemplate,
  selectExchangeTemplateById,
} from './ExchangeTemplatesSlice';

export default function ExchangeTemplate(): ReactElement {
  const { exchangeTemplateId } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    const query = { id: exchangeTemplateId };
    log.debug(`fetching exchangeTemplate ${exchangeTemplateId}`);
    dispatch(fetchExchangeTemplate(query));
  }, [exchangeTemplateId]);

  const exchangeTemplate = useSelector((state) =>
    selectExchangeTemplateById(state, exchangeTemplateId),
  );

  if (!exchangeTemplate) {
    return <div>ExchangeTemplate Not Found</div>;
  }

  // show first trigger only if triggers exist
  const trigger = exchangeTemplate?.triggers?.length
    ? exchangeTemplate.triggers[0]
    : null;

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
        <Typography level="h2">ExchangeTemplate</Typography>
      </Box>
      <Typography sx={{}} level="title-md">
        Name
      </Typography>
      <Typography>{exchangeTemplate.name}</Typography>
      <Typography sx={{ mt: 1 }} level="title-md">
        Description
      </Typography>
      <Typography>{exchangeTemplate.description}</Typography>
      <Typography sx={{ mt: 1 }} level="title-md">
        Instructions
      </Typography>
      <Typography>{exchangeTemplate.instructions}</Typography>
      <Typography sx={{ mt: 1 }} level="title-md">
        Assistant
      </Typography>
      <Typography>{exchangeTemplate?.assistant?.name || '—'}</Typography>
      <Typography sx={{ mt: 1 }} level="title-md">
        Trigger
      </Typography>
      <Typography>{trigger?.name || '—'}</Typography>
    </>
  );
}
