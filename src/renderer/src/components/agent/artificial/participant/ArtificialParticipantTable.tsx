import { ReactElement, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';

import Box from '@mui/joy/Box';
import Checkbox from '@mui/joy/Checkbox';
import Link from '@mui/joy/Link';
import Sheet from '@mui/joy/Sheet';
import Table from '@mui/joy/Table';
import Typography from '@mui/joy/Typography';

import { Order, getComparator, stableSort } from '@renderer/utils/sort';
import _ from 'lodash';

import RowMenu from '../../../common/RowMenu';
import { deleteAgent, selectArtificialParticipants } from '../../AgentsSlice';

/**
 * Renders a sortable and selectable table of artificial participants.
 *
 * This component retrieves participants from the Redux store and displays them in a table layout. It features
 * checkboxes for selecting individual or all participants, supports internationalized header and link text via
 * the useTranslation hook, and sorts rows by participant ID. Each row provides actions to view, edit, or delete
 * the respective participant.
 *
 * @returns A React Element representing the artificial participants table.
 */
function ArtificialParticipantTable(): ReactElement {
  const [order] = useState<Order>('desc');
  const [selected, setSelected] = useState<readonly string[]>([]);

  const agents = useSelector(selectArtificialParticipants);
  const { t } = useTranslation();

  return (
    <>
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
                    selected.length > 0 && selected.length !== agents.length
                  }
                  checked={selected.length === agents.length}
                  onChange={(event) => {
                    setSelected(
                      event.target.checked ? agents.map((row) => row.id) : [],
                    );
                  }}
                  color={
                    selected.length > 0 || selected.length === agents.length
                      ? 'primary'
                      : undefined
                  }
                  sx={{ verticalAlign: 'text-bottom' }}
                />
              </th>
              <th style={{ width: 100, padding: '12px 6px' }}>{t('Name')}</th>
              <th style={{ width: 100, padding: '12px 6px' }}>Description</th>
              <th style={{ width: 50, padding: '12px 6px' }}></th>
            </tr>
          </thead>
          <tbody>
            {stableSort(agents, getComparator(order, 'id')).map((row) => (
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
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Link
                      level="body-xs"
                      component={RouterLink}
                      to={`/agents/artificial/participants/${row.id}`}
                    >
                      {t('View')}
                    </Link>
                    <RowMenu
                      rowId={row.id}
                      deleteHandler={deleteAgent}
                      editPath={`/agents/artificial/participants/${row.id}/edit`}
                    />
                  </Box>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Sheet>
    </>
  );
}

export default ArtificialParticipantTable;
