import { ReactElement, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';

import Button from '@mui/joy/Button';

import { fetchAgents } from '../../AgentsSlice';
import ArtificialEvaluatorTable from './ArtificialEvaluatorTable';

/**
 * Renders the UI for managing artificial evaluators.
 *
 * On mount, the component dispatches an action to fetch agent data. It displays a primary-colored button that navigates
 * to the page for creating a new artificial evaluator with a label that is translated for internationalization support,
 * followed by a table of the existing artificial evaluators.
 *
 * @returns A React element representing the artificial evaluators management interface.
 */
export default function ArtificialEvaluators(): ReactElement {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(fetchAgents());
  }, []);
  return (
    <div>
      <Button
        color="primary"
        to="/agents/artificial/evaluators/new"
        component={RouterLink}
      >
        {t('New Artificial Evaluator')}
      </Button>
      <ArtificialEvaluatorTable />
    </div>
  );
}
