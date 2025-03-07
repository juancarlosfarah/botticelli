import { ReactElement, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';

import Button from '@mui/joy/Button';

import { fetchAgents } from '../../AgentsSlice';
import HumanAssistantTable from './HumanAssistantTable';

export default function HumanAssistants(): ReactElement {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(fetchAgents());
  }, []);
  return (
    <div>
      <Button
        color="primary"
        to="/agents/human/assistants/new"
        component={RouterLink}
      >
        {t('New Human Assistant')}
      </Button>
      <HumanAssistantTable />
    </div>
  );
}
