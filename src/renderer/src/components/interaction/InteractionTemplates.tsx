import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';

import Button from '@mui/joy/Button';

import InteractionTemplateList from './InteractionTemplateList.tsx';
import InteractionTemplateTable from './InteractionTemplateTable.tsx';
import { fetchInteractionTemplates } from './InteractionTemplatesSlice';

export default function InteractionTemplates(): JSX.Element {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(fetchInteractionTemplates());
  }, []);

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
