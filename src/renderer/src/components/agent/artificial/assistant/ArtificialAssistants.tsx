import { ReactElement, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';

import Button from '@mui/joy/Button';

import { selectCurrentUser } from '@renderer/components/user/UsersSlice';
import { AppDispatch } from '@renderer/store';

import { fetchAgents } from '../../AgentsSlice';
import ArtificialAssistantTable from './ArtificialAssistantTable';

export default function ArtificialAssistants(): ReactElement {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();
  const currentUser = useSelector(selectCurrentUser);

  useEffect(() => {
    if (currentUser) {
      dispatch(fetchAgents({ email: currentUser }));
    }
  }, [dispatch, currentUser]);
  return (
    <div>
      <Button
        color="primary"
        to="/agents/artificial/assistants/new"
        component={RouterLink}
      >
        {t('New Artificial Assistant')}
      </Button>
      <ArtificialAssistantTable />
    </div>
  );
}
