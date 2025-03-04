import { ReactElement, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { Button } from '@mui/joy';
import Box from '@mui/joy/Box';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import Typography from '@mui/joy/Typography';

import InteractionTemplateType from '@shared/interfaces/InteractionTemplate';
import InteractionTemplateExchangeTemplate from '@shared/interfaces/InteractionTemplateExchangeTemplate';
import log from 'electron-log/renderer';
import _ from 'lodash';

import { AppDispatch, RootState } from '../../store';
import CustomBreadcrumbs from '../layout/CustomBreadcrumbs';
import {
  fetchInteractionTemplate,
  selectInteractionTemplateById,
} from './InteractionTemplatesSlice';

export default function InteractionTemplate(): ReactElement {
  const { interactionTemplateId } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (typeof interactionTemplateId === 'undefined') {
    return <div>Interaction Not Found</div>;
  }

  useEffect(() => {
    const query = { id: interactionTemplateId };
    log.debug(`fetching interaction template ${interactionTemplateId}`);
    dispatch(fetchInteractionTemplate(query));
  }, [interactionTemplateId]);

  const interactionTemplate: InteractionTemplateType | undefined = useSelector(
    (state: RootState) =>
      selectInteractionTemplateById(state, interactionTemplateId),
  );

  if (!interactionTemplate) {
    return <div>Interaction Template Not Found</div>;
  }

  const exchangeTemplates = interactionTemplate?.exchangeTemplates || [];

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          my: 1,
        }}
      >
        <Button color="neutral" onClick={() => navigate(-1)}>
          {t('Back')}
        </Button>
      </Box>
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
        {t('Name')}
      </Typography>
      <Typography>{interactionTemplate.name}</Typography>

      <Typography sx={{ mt: 1 }} level="title-md">
        Description
      </Typography>
      <Typography>{interactionTemplate.description}</Typography>

      <Typography sx={{ mt: 1 }} level="title-md">
        {t('Model Instructions')}
      </Typography>
      <Typography>{interactionTemplate.modelInstructions}</Typography>

      <Typography sx={{ mt: 1 }} level="title-md">
        {t('Participant Instructions')}
      </Typography>
      <Typography>{interactionTemplate.participantInstructions}</Typography>

      <Typography sx={{ mt: 1 }} level="title-md">
        {t('Participant Instructions On Complete')}
      </Typography>
      <Typography>
        {interactionTemplate.participantInstructionsOnComplete}
      </Typography>

      <Typography sx={{ mt: 1 }} level="title-md">
        {t('Exchange Templates')}
      </Typography>
      <List component="ol" marker="decimal">
        {_.orderBy(exchangeTemplates, 'order').map(
          (exchangeTemplate: InteractionTemplateExchangeTemplate) => {
            return (
              <ListItem key={exchangeTemplate?.exchangeTemplate?.id}>
                {exchangeTemplate?.exchangeTemplate?.name || '—'}
              </ListItem>
            );
          },
        ) || '—'}
      </List>
    </>
  );
}
