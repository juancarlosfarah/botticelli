import * as React from 'react';
import { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';

// icons
import Box from '@mui/joy/Box';
import Checkbox from '@mui/joy/Checkbox';
import Link from '@mui/joy/Link';
import Sheet from '@mui/joy/Sheet';
import Table from '@mui/joy/Table';
import Typography from '@mui/joy/Typography';

import _ from 'lodash';

import { Order, getComparator, stableSort } from '../../utils/sort';
import RowMenu from '../common/RowMenu';
import {
  deleteOneExchangeTemplate,
  selectAllExchangeTemplates,
} from './ExchangeTemplatesSlice';

export default function ExchangeTemplateTable(): ReactElement {
  const [order, setOrder] = React.useState<Order>('asc');
  const [selected, setSelected] = React.useState<readonly string[]>([]);

  const exchangeTemplates = useSelector(selectAllExchangeTemplates);
  const { t } = useTranslation();

  const handleSetOrder = (): void => {
    if (order === 'desc') {
      setOrder('asc');
    } else if (order === 'asc') {
      setOrder('desc');
    } else {
      setOrder('asc');
    }
  };

  return (
    <React.Fragment>
      <Sheet
        className="OrderTableContainer"
        variant="outlined"
        sx={{
          display: { xs: 'none', sm: 'initial' },
          width: '100%',
          borderRadius: 'sm',
          flexShrink: 1,
          overflow: 'auto',
          minHeight: 0,
        }}
      >
        <Table
          aria-labelledby="tableTitle"
          stickyHeader
          hoverRow
          sx={{
            '--TableCell-headBackground':
              'var(--joy-palette-background-level1)',
            '--Table-headerUnderlineThickness': '1px',
            '--TableRow-hoverBackground':
              'var(--joy-palette-background-level1)',
            '--TableCell-paddingY': '4px',
            '--TableCell-paddingX': '8px',
            mt: 5,
          }}
        >
          <thead>
            <tr>
              <th
                style={{ width: 48, textAlign: 'center', padding: '12px 6px' }}
              >
                <Checkbox
                  size="sm"
                  indeterminate={
                    selected.length > 0 &&
                    selected.length !== exchangeTemplates.length
                  }
                  checked={selected.length === exchangeTemplates.length}
                  onChange={(event): void => {
                    setSelected(
                      event.target.checked
                        ? exchangeTemplates.map((row) => row.id)
                        : [],
                    );
                  }}
                  color={
                    selected.length > 0 ||
                    selected.length === exchangeTemplates.length
                      ? 'primary'
                      : undefined
                  }
                  sx={{ verticalAlign: 'text-bottom' }}
                />
              </th>
              <th style={{ width: 100, padding: '12px 6px' }}>
                <Link onClick={handleSetOrder}>{t('Name')}</Link>
              </th>
              <th style={{ width: 100, padding: '12px 6px' }}>Description</th>
              <th style={{ width: 50, padding: '12px 6px' }}> </th>
            </tr>
          </thead>
          <tbody>
            {stableSort(exchangeTemplates, getComparator(order, 'name')).map(
              (row) => (
                <tr key={row.id}>
                  <td style={{ textAlign: 'center', width: 120 }}>
                    <Checkbox
                      size="sm"
                      checked={selected.includes(row.id)}
                      color={selected.includes(row.id) ? 'primary' : undefined}
                      onChange={(event): void => {
                        setSelected((ids) =>
                          event.target.checked
                            ? ids.concat(row.id)
                            : ids.filter((itemId) => itemId !== row.id),
                        );
                      }}
                      slotProps={{ checkbox: { sx: { textAlign: 'left' } } }}
                      sx={{ verticalAlign: 'text-bottom' }}
                    />
                  </td>
                  <td>
                    <Typography level="body-xs">
                      {_.truncate(row.name, 25)}
                    </Typography>
                  </td>
                  <td>
                    <Typography level="body-xs">
                      {_.truncate(row.description, 25)}
                    </Typography>
                  </td>
                  <td>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                      <Link
                        level="body-xs"
                        component={RouterLink}
                        to={`/exchanges/templates/${row.id}`}
                      >
                        {t('View')}
                      </Link>
                      <RowMenu
                        rowId={row.id}
                        deleteHandler={deleteOneExchangeTemplate}
                        editPath={`/exchanges/templates/${row.id}/edit`}
                      />
                    </Box>
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </Table>
      </Sheet>
    </React.Fragment>
  );
}
