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
import { deleteTrigger, selectTriggers } from './TriggersSlice';

export default function TriggerTable(): ReactElement {
  const [order] = React.useState<Order>('desc');
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const { t } = useTranslation();

  const triggers = useSelector(selectTriggers);

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
                    selected.length > 0 && selected.length !== triggers.length
                  }
                  checked={selected.length === triggers.length}
                  onChange={(event) => {
                    setSelected(
                      event.target.checked ? triggers.map((row) => row.id) : [],
                    );
                  }}
                  color={
                    selected.length > 0 || selected.length === triggers.length
                      ? 'primary'
                      : undefined
                  }
                  sx={{ verticalAlign: 'text-bottom' }}
                />
              </th>
              <th style={{ width: 100, padding: '12px 6px' }}>{t('Name')}</th>
              <th style={{ width: 100, padding: '12px 6px' }}>
                {t('Description')}
              </th>
              <th style={{ width: 100, padding: '12px 6px' }}>
                {t('Evaluator')}
              </th>
              <th style={{ width: 50, padding: '12px 6px' }}> </th>
            </tr>
          </thead>
          <tbody>
            {stableSort(triggers, getComparator(order, 'id')).map((row) => (
              <tr key={row.id}>
                <td style={{ textAlign: 'center', width: 120 }}>
                  <Checkbox
                    size="sm"
                    checked={selected.includes(row.id)}
                    color={selected.includes(row.id) ? 'primary' : undefined}
                    onChange={(event) => {
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
                    {_.truncate(row.name, { length: 25 })}
                  </Typography>
                </td>
                <td>
                  <Typography level="body-xs">
                    {_.truncate(row.description, { length: 25 })}
                  </Typography>
                </td>
                <td>
                  <Typography level="body-xs">
                    {row.evaluator?.name || '—'}
                  </Typography>
                </td>
                <td>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Link
                      level="body-xs"
                      component={RouterLink}
                      to={`/triggers/${row.id}`}
                    >
                      {t('View')}
                    </Link>
                    <RowMenu
                      rowId={row.id}
                      deleteHandler={deleteTrigger}
                      editPath={`/triggers/${row.id}/edit`}
                    />
                  </Box>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Sheet>

      {/* todo: pagination */}
      {/*<Box*/}
      {/*  className="Pagination-laptopUp"*/}
      {/*  sx={{*/}
      {/*    pt: 2,*/}
      {/*    gap: 1,*/}
      {/*    [`& .${iconButtonClasses.root}`]: { borderRadius: '50%' },*/}
      {/*    display: {*/}
      {/*      xs: 'none',*/}
      {/*      md: 'flex',*/}
      {/*    },*/}
      {/*  }}*/}
      {/*>*/}
      {/*  <Button*/}
      {/*    size="sm"*/}
      {/*    variant="outlined"*/}
      {/*    color="neutral"*/}
      {/*    startDecorator={<KeyboardArrowLeftIcon />}*/}
      {/*  >*/}
      {/*    Previous*/}
      {/*  </Button>*/}

      {/*  <Box sx={{ flex: 1 }} />*/}
      {/*  {['1', '2', '3', '…', '8', '9', '10'].map((page) => (*/}
      {/*    <IconButton*/}
      {/*      key={page}*/}
      {/*      size="sm"*/}
      {/*      variant={Number(page) ? 'outlined' : 'plain'}*/}
      {/*      color="neutral"*/}
      {/*    >*/}
      {/*      {page}*/}
      {/*    </IconButton>*/}
      {/*  ))}*/}
      {/*  <Box sx={{ flex: 1 }} />*/}

      {/*  <Button*/}
      {/*    size="sm"*/}
      {/*    variant="outlined"*/}
      {/*    color="neutral"*/}
      {/*    endDecorator={<KeyboardArrowRightIcon />}*/}
      {/*  >*/}
      {/*    Next*/}
      {/*  </Button>*/}
      {/*</Box>*/}
    </React.Fragment>
  );
}
