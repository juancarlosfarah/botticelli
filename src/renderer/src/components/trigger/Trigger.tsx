import { ReactElement, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { Button } from '@mui/joy';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';

import { fetchMessages } from '../Messages/MessagesSlice';
import CustomBreadcrumbs from '../layout/CustomBreadcrumbs';
import { selectCurrentUser } from '../user/UsersSlice';
import { fetchTrigger, selectTriggerById } from './TriggersSlice';

export default function Trigger(): ReactElement {
  const { triggerId } = useParams();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const email = useSelector(selectCurrentUser);

  useEffect(() => {
    if (triggerId && email) {
      const query = { id: triggerId, email };
      dispatch(fetchTrigger(query));
      dispatch(fetchMessages(query));
    }
  }, [triggerId, email]);
  const trigger = useSelector((state) => selectTriggerById(state, triggerId));

  if (!trigger) {
    return <div>{t('Trigger Not Found')}</div>;
  }

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
        <Typography level="h2">{t('Trigger')}</Typography>
      </Box>
      <Typography sx={{}} level="title-md">
        {t('Name')}
      </Typography>
      <Typography>{trigger.name}</Typography>
      <Typography sx={{ mt: 1 }} level="title-md">
        Description
      </Typography>
      <Typography>{trigger.description}</Typography>
      <Typography sx={{ mt: 1 }} level="title-md">
        {t('Criteria')}
      </Typography>
      <Typography>{trigger.criteria}</Typography>
      <Typography sx={{ mt: 1 }} level="title-md">
        {t('Evaluator')}
      </Typography>
      <Typography>{trigger?.evaluator?.name || '—'}</Typography>
    </>
  );
}
