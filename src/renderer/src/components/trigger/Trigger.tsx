import { ReactElement, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';

import log from 'electron-log/renderer';

import { fetchMessages } from '../Messages/MessagesSlice';
import CustomBreadcrumbs from '../layout/CustomBreadcrumbs';
import { fetchTrigger, selectTriggerById } from './TriggersSlice';

export default function Trigger(): ReactElement {
  const { triggerId } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    const query = { id: triggerId };
    log.debug(`fetching trigger ${triggerId}`);
    dispatch(fetchTrigger(query));
    dispatch(fetchMessages({ triggerId }));
  }, [triggerId]);

  const trigger = useSelector((state) => selectTriggerById(state, triggerId));

  if (!trigger) {
    return <div>Trigger Not Found</div>;
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
        <Typography level="h2">{`Trigger #${triggerId}`}</Typography>
      </Box>
      <Typography sx={{}} level="title-md">
        Name
      </Typography>
      <Typography>{trigger.name}</Typography>
      <Typography sx={{ mt: 1 }} level="title-md">
        Description
      </Typography>
      <Typography>{trigger.description}</Typography>
      <Typography sx={{ mt: 1 }} level="title-md">
        Criteria
      </Typography>
      <Typography>{trigger.criteria}</Typography>
      <Typography sx={{ mt: 1 }} level="title-md">
        Evaluator
      </Typography>
      <Typography>{trigger?.evaluator?.name || '—'}</Typography>
    </>
  );
}
