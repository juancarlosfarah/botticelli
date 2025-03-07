import { ReactElement, useEffect } from 'react';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';

import { Button, Tooltip } from '@mui/joy';
import Box from '@mui/joy/Box';
import Chip from '@mui/joy/Chip';
import Link from '@mui/joy/Link';
import Sheet from '@mui/joy/Sheet';
import Table from '@mui/joy/Table';
import Typography from '@mui/joy/Typography';
import { ColorPaletteProp } from '@mui/joy/styles';

import log from 'electron-log/renderer';
import _ from 'lodash';

import { AppDispatch } from '../../store';
import { Order, getComparator, stableSort } from '../../utils/sort';
import { setCurrentExchange } from '../interaction/InteractionsSlice';
import CustomBreadcrumbs from '../layout/CustomBreadcrumbs';
import { fetchExperiment, selectExperimentById } from './ExperimentsSlice';

/**
 * Renders the experiment details page.
 *
 * This component retrieves the experiment ID from the URL, fetches the corresponding experiment data via Redux,
 * and displays the experiment's name, description, participants, and their interactions. It supports internationalization,
 * provides a back navigation button, and enables users to initiate or resume exchanges, updating the Redux state accordingly.
 * If the experiment ID is missing or the experiment cannot be found, an error message is displayed.
 *
 * @returns A React element representing the experiment details view.
 */
export default function Experiment(): ReactElement {
  const { experimentId } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [order, setOrder] = React.useState<Order>('desc');

  useEffect(() => {
    const query = { id: experimentId };
    log.debug(`fetching experiment ${experimentId}`);
    dispatch(fetchExperiment(query));
  }, [experimentId]);

  if (!experimentId) {
    return <div>{t('Invalid Experiment ID')}</div>;
  }

  const experiment = useSelector((state) =>
    selectExperimentById(state, experimentId),
  );

  if (!experiment) {
    return <div>{t('Experiment Not Found')}</div>;
  }

  const participants = experiment.participants || [];
  let interactionTemplates = experiment.interactionTemplates || [];
  const interactions = experiment.interactions || [];

  interactionTemplates = _.orderBy(interactionTemplates, 'order', 'asc');

  const handleClickExchange = async ({ interactionId, currentExchangeId }) => {
    await dispatch(setCurrentExchange({ interactionId, currentExchangeId }));
    dispatch(fetchExperiment({ id: experimentId }));
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          my: 1,
        }}
      >
        <Button color="neutral" onClick={() => navigate(-1)}>
          {t('Back')}
        </Button>
      </Box>

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
        <Typography level="h2">{t('Experiment')}</Typography>
      </Box>
      <Typography sx={{}} level="title-md">
        {t('Name')}
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
          aria-labelledby="experiment table"
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
              <th style={{ width: 100, padding: '12px 6px' }}>{t('Name')}</th>
              {interactionTemplates.map((interactionTemplate) => {
                return (
                  <th
                    key={interactionTemplate?.interactionTemplate?.id}
                    style={{ width: 100, padding: '12px 6px' }}
                  >
                    {interactionTemplate?.interactionTemplate?.name || '—'}
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
                  'order',
                  'asc',
                ).map((interaction) => {
                  const viewParticipantInteractionText = !interaction.started
                    ? t('Start')
                    : t('Resume');
                  return (
                    <td key={interaction.id} style={{ overflowX: 'scroll' }}>
                      {_.orderBy(interaction.exchanges, 'order', 'asc').map(
                        (exchange) => {
                          // only show click if the exchange has not been dismissed
                          // and the interaction has not been completed
                          const handleClick =
                            !exchange.dismissed && !interaction.completed
                              ? () =>
                                  handleClickExchange({
                                    interactionId: interaction.id,
                                    currentExchangeId: exchange.id,
                                  })
                              : undefined;
                          const isCurrentExchange =
                            exchange.id === interaction.currentExchange;
                          let color: ColorPaletteProp = 'primary';
                          if (exchange.started) {
                            color = 'warning';
                          }
                          if (exchange.completed) {
                            color = 'success';
                          }
                          const border = isCurrentExchange
                            ? `solid gray 2px`
                            : 'none';
                          return (
                            <tr key={exchange.id}>
                              <td style={{ border: 'none' }}>
                                <Tooltip
                                  title={
                                    isCurrentExchange ? 'Current Exchange' : ''
                                  }
                                >
                                  <Chip
                                    variant="soft"
                                    color={color}
                                    key={exchange.id}
                                    sx={{
                                      border,
                                      '&.Mui-disabled > button': {
                                        // ensure the background color remains the same when disabled
                                        backgroundColor: (theme) =>
                                          theme.palette[color].softBg,
                                      },
                                    }}
                                    disabled={isCurrentExchange}
                                    onClick={handleClick}
                                  >
                                    <Typography level="body-xs">
                                      {exchange.name}{' '}
                                      {exchange.dismissed && '✓'}
                                    </Typography>
                                  </Chip>
                                </Tooltip>
                              </td>
                            </tr>
                          );
                        },
                      )}
                      <table>
                        <tr>
                          {!interaction.completed && (
                            <td>
                              <Link
                                level="body-xs"
                                component={RouterLink}
                                sx={{ ml: 1 }}
                                to={`/experiments/${experimentId}/participants/${row.id}/interactions/${interaction.id}`}
                              >
                                {viewParticipantInteractionText}
                              </Link>
                            </td>
                          )}
                          <td>
                            <Link
                              level="body-xs"
                              component={RouterLink}
                              sx={{ ml: 1 }}
                              to={`/interactions/${interaction.id}`}
                            >
                              View
                            </Link>
                          </td>
                        </tr>
                      </table>
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
