import { ReactElement, useEffect } from 'react';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink, useParams } from 'react-router-dom';

import Box from '@mui/joy/Box';
import Chip from '@mui/joy/Chip';
import Link from '@mui/joy/Link';
import Sheet from '@mui/joy/Sheet';
import Table from '@mui/joy/Table';
import Typography from '@mui/joy/Typography';

import log from 'electron-log/renderer';
import _ from 'lodash';

import { Order, getComparator, stableSort } from '../../utils/sort';
import CustomBreadcrumbs from '../layout/CustomBreadcrumbs';
import { fetchExperiment, selectExperimentById } from './ExperimentsSlice';

export default function Experiment(): ReactElement {
  const { experimentId } = useParams();
  const dispatch = useDispatch();

  const [order, setOrder] = React.useState<Order>('desc');

  useEffect(() => {
    const query = { id: experimentId };
    log.debug(`fetching experiment ${experimentId}`);
    dispatch(fetchExperiment(query));
  }, [experimentId]);

  const experiment = useSelector((state) =>
    selectExperimentById(state, experimentId),
  );

  if (!experiment) {
    return <div>Experiment Not Found</div>;
  }

  const participants = experiment.participants || [];
  let interactionTemplates = experiment.interactionTemplates || [];
  const interactions = experiment.interactions || [];

  interactionTemplates = _.orderBy(interactionTemplates, 'name', 'asc');

  return (
    <>
      <CustomBreadcrumbs />
      <Box
        sx={{
          display: 'flex',
          my: 1,
          gap: 1,
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'start', sm: 'center' },
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        }}
      >
        <Typography level="h2">Experiment</Typography>
      </Box>
      <Typography sx={{}} level="title-md">
        Name
      </Typography>
      <Typography>{experiment.name}</Typography>
      <Typography sx={{ mt: 1 }} level="title-md">
        Description
      </Typography>
      <Typography>{experiment.description}</Typography>
      <Typography sx={{ mt: 1 }} level="title-md">
        Participants
      </Typography>
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
          }}
        >
          <thead>
            <tr>
              <th style={{ width: 100, padding: '12px 6px' }}>Name</th>
              {interactionTemplates.map((interactionTemplate) => {
                return (
                  <th
                    key={interactionTemplate.id}
                    style={{ width: 100, padding: '12px 6px' }}
                  >
                    {interactionTemplate.name || '—'}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {stableSort(participants, getComparator(order, 'id')).map((row) => (
              <tr key={row.id}>
                <td>
                  <Typography level="body-xs">
                    {_.truncate(row.name, 25)}
                  </Typography>
                </td>
                {_.orderBy(
                  interactions.filter(
                    (interaction) => interaction?.participant?.id === row?.id,
                  ),
                  'name',
                  'asc',
                ).map((interaction) => {
                  return (
                    <td key={interaction.id}>
                      {_.orderBy(interaction.exchanges, 'name', 'asc').map(
                        (exchange) => {
                          const color = exchange.completed
                            ? 'success'
                            : 'primary';
                          return (
                            <Chip
                              variant="soft"
                              color={color}
                              key={exchange.id}
                            >
                              <Typography level="body-xs">
                                {exchange.name}
                              </Typography>
                            </Chip>
                          );
                        },
                      )}
                      <Link
                        level="body-xs"
                        component={RouterLink}
                        sx={{ ml: 1 }}
                        to={`/experiments/${experimentId}/participants/${row.id}/interactions/${interaction.id}`}
                      >
                        Start
                      </Link>
                      <Link
                        level="body-xs"
                        component={RouterLink}
                        sx={{ ml: 1 }}
                        to={`/interactions/${interaction.id}`}
                      >
                        View
                      </Link>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </Table>
      </Sheet>
    </>
  );
}
