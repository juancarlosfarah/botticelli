import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';

import Button from '@mui/joy/Button';

import { AppDispatch } from '@renderer/store.ts';

import { selectCurrentUser } from '../user/UsersSlice.ts';
import InteractionTemplateList from './InteractionTemplateList.tsx';
import InteractionTemplateTable from './InteractionTemplateTable.tsx';
import { fetchInteractionTemplates } from './InteractionTemplatesSlice';

export default function InteractionTemplates(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();
  const currentUser = useSelector(selectCurrentUser);

  useEffect(() => {
    if (currentUser) {
      dispatch(fetchInteractionTemplates({ email: currentUser }));
    }
  }, [dispatch, currentUser]);

  return (
    <div>
      <Button
        color="primary"
        to="/interactions/templates/new"
        component={RouterLink}
      >
        {t('New Interaction Template')}
      </Button>
      <InteractionTemplateTable />
      <InteractionTemplateList />
    </div>
  );
}
