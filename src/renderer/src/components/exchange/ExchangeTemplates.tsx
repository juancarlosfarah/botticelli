import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';

import Button from '@mui/joy/Button';

import { AppDispatch } from '../../store';
import ExchangeTemplateList from './ExchangeTemplateList';
import ExchangeTemplateTable from './ExchangeTemplateTable.tsx';
import { fetchExchangeTemplates } from './ExchangeTemplatesSlice';

/**
 * Renders the ExchangeTemplates component.
 *
 * On mount, this component dispatches an action to fetch exchange templates and displays them in
 * both a table and a list view. It also includes a button that navigates to the new exchange template
 * creation page, with its label internationalized.
 *
 * @returns A JSX element representing the exchange template interface.
 */
export default function ExchangeTemplates(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(fetchExchangeTemplates());
  }, []);

  return (
    <div>
      <Button
        color="primary"
        to="/exchanges/templates/new"
        component={RouterLink}
      >
        {t('New Exchange Template')}
      </Button>
      <ExchangeTemplateTable />
      <ExchangeTemplateList />
    </div>
  );
}
