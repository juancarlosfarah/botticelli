import { ReactElement, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import Box from '@mui/joy/Box';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import Typography from '@mui/joy/Typography';

import Trigger from '@shared/interfaces/Trigger';
import log from 'electron-log/renderer';
import capitalize from 'lodash.capitalize';

import { AppDispatch, RootState } from '../../store';
import CustomBreadcrumbs from '../layout/CustomBreadcrumbs';
import {
  fetchExchangeTemplate,
  selectExchangeTemplateById,
} from './ExchangeTemplatesSlice';

export default function ExchangeTemplate(): ReactElement {
  const { exchangeTemplateId } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();

  if (!exchangeTemplateId) {
    return <div>Invalid Exchange Template ID</div>;
  }

  useEffect(() => {
    const query = { id: exchangeTemplateId };
    log.debug(`fetching exchangeTemplate ${exchangeTemplateId}`);
    dispatch(fetchExchangeTemplate(query));
  }, [exchangeTemplateId]);

  const exchangeTemplate = useSelector((state: RootState) =>
    selectExchangeTemplateById(state, exchangeTemplateId),
  );

  if (!exchangeTemplate) {
    return <div>{t('Exchange Template Not Found')}</div>;
  }

  // extract triggers
  const { triggers = [] } = exchangeTemplate;

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
        <Typography level="h2">{t('Exchange Template')}</Typography>
      </Box>

      <Typography sx={{}} level="title-md">
        {t('Name')}
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
        Cue
      </Typography>
      <Typography>{exchangeTemplate.cue}</Typography>

      <Typography sx={{ mt: 1 }} level="title-md">
        {t('Input Type')}
      </Typography>
      <Typography>{capitalize(exchangeTemplate.inputType)}</Typography>

      <Typography sx={{ mt: 1 }} level="title-md">
        Assistant
      </Typography>
      <Typography>{exchangeTemplate?.assistant?.name || '—'}</Typography>

      <Typography sx={{ mt: 1 }} level="title-md">
        {t('Soft Limit')}
      </Typography>
      <Typography>{exchangeTemplate?.softLimit || '—'}</Typography>

      <Typography sx={{ mt: 1 }} level="title-md">
        {t('Hard Limit')}
      </Typography>
      <Typography>{exchangeTemplate?.hardLimit || '—'}</Typography>

      <Typography sx={{ mt: 1 }} level="title-md">
        {t('Instructions On Complete')}
      </Typography>
      <Typography>
        {exchangeTemplate.participantInstructionsOnComplete}
      </Typography>

      <Typography sx={{ mt: 1 }} level="title-md">
        {t('Triggers')}
      </Typography>
      <List component="ol" marker="decimal">
        {triggers.map((trigger: Trigger) => {
          return <ListItem key={trigger.id}>{trigger?.name || '—'}</ListItem>;
        }) || '—'}
      </List>
    </>
  );
}
