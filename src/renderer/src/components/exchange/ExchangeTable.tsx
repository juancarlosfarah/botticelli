import * as React from 'react';
import { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';
import BlockIcon from '@mui/icons-material/Block';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
// icons
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import SearchIcon from '@mui/icons-material/Search';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Checkbox from '@mui/joy/Checkbox';
import Chip from '@mui/joy/Chip';
import Divider from '@mui/joy/Divider';
import Dropdown from '@mui/joy/Dropdown';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import IconButton, { iconButtonClasses } from '@mui/joy/IconButton';
import Input from '@mui/joy/Input';
import Link from '@mui/joy/Link';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import ModalDialog from '@mui/joy/ModalDialog';
import Option from '@mui/joy/Option';
import Select from '@mui/joy/Select';
import Sheet from '@mui/joy/Sheet';
import Table from '@mui/joy/Table';
import Typography from '@mui/joy/Typography';
import { ColorPaletteProp } from '@mui/joy/styles';

import _ from 'lodash';

import { Order, getComparator, stableSort } from '../../utils/sort';
import RowMenu from '../common/RowMenu';
import { deleteOneExchange, selectAllExchanges } from './ExchangesSlice';

export default function ExchangeTable(): ReactElement {
  const [order, setOrder] = React.useState<Order>('desc');
  const [selected, setSelected] = React.useState<readonly string[]>([]);

  const exchanges = useSelector(selectAllExchanges);

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
                    selected.length > 0 && selected.length !== exchanges.length
                  }
                  checked={selected.length === exchanges.length}
                  onChange={(event) => {
                    setSelected(
                      event.target.checked
                        ? exchanges.map((row) => row.id)
                        : [],
                    );
                  }}
                  color={
                    selected.length > 0 || selected.length === exchanges.length
                      ? 'primary'
                      : undefined
                  }
                  sx={{ verticalAlign: 'text-bottom' }}
                />
              </th>
              <th style={{ width: 100, padding: '12px 6px' }}>Name</th>
              <th style={{ width: 100, padding: '12px 6px' }}>Description</th>
              <th style={{ width: 100, padding: '12px 6px' }}>
                Number of Messages
              </th>
              <th style={{ width: 100, padding: '12px 6px' }}>Assistant</th>
              <th style={{ width: 100, padding: '12px 6px' }}>Participant</th>
              <th style={{ width: 50, padding: '12px 6px' }}> </th>
            </tr>
          </thead>
          <tbody>
            {stableSort(exchanges, getComparator(order, 'id')).map((row) => (
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
                    {_.truncate(row.name, 25)}
                  </Typography>
                </td>
                <td>
                  <Typography level="body-xs">
                    {_.truncate(row.description, 25)}
                  </Typography>
                </td>
                <td>
                  <Typography level="body-xs">
                    {row.messages?.length || 0}
                  </Typography>
                </td>
                <td>
                  <Typography level="body-xs">
                    {row?.assistant?.name || '—'}
                  </Typography>
                </td>
                <td>
                  <Typography level="body-xs">
                    {row?.interaction?.participant?.name || '—'}
                  </Typography>
                </td>
                <td>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Link
                      level="body-xs"
                      component={RouterLink}
                      to={`/exchanges/${row.id}`}
                    >
                      View
                    </Link>
                    <RowMenu rowId={row.id} deleteHandler={deleteOneExchange} />
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
