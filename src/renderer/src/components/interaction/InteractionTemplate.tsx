import { ReactElement, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import Box from '@mui/joy/Box';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import Typography from '@mui/joy/Typography';

import log from 'electron-log/renderer';

import CustomBreadcrumbs from '../layout/CustomBreadcrumbs';
import {
  fetchInteractionTemplate,
  selectInteractionTemplateById,
} from './InteractionTemplatesSlice';

export default function InteractionTemplate(): ReactElement {
  const { interactionTemplateId } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    const query = { id: interactionTemplateId };
    log.debug(`fetching interaction template ${interactionTemplateId}`);
    dispatch(fetchInteractionTemplate(query));
  }, [interactionTemplateId]);

  const interactionTemplate = useSelector((state) =>
    selectInteractionTemplateById(state, interactionTemplateId),
  );

  if (!interactionTemplate) {
    return <div>Interaction Template Not Found</div>;
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
      <Typography>{interactionTemplate.name}</Typography>

      <Typography sx={{ mt: 1 }} level="title-md">
        Description
      </Typography>
      <Typography>{interactionTemplate.description}</Typography>

      <Typography sx={{ mt: 1 }} level="title-md">
        Instructions
      </Typography>
      <Typography>{interactionTemplate.instructions}</Typography>

      <Typography sx={{ mt: 1 }} level="title-md">
        Exchange Templates
      </Typography>
      <List component="ol" marker="decimal">
        {interactionTemplate?.exchangeTemplates?.map((exchangeTemplate) => {
          return (
            <ListItem key={exchangeTemplate.id}>
              {exchangeTemplate.name || '—'}
            </ListItem>
          );
        }) || '—'}
      </List>
    </>
  );
}
