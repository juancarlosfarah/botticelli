import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';

import Button from '@mui/joy/Button';

import ExchangeTemplateList from './ExchangeTemplateList';
import ExchangeTemplateTable from './ExchangeTemplateTable.tsx';
import { fetchExchangeTemplates } from './ExchangeTemplatesSlice';

export default function ExchangeTemplates(): JSX.Element {
  const dispatch = useDispatch();

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
        New Exchange Template
      </Button>
      <ExchangeTemplateTable />
      <ExchangeTemplateList />
    </div>
  );
}
