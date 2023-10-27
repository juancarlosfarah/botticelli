import * as React from 'react';
import { ColorPaletteProp } from '@mui/joy/styles';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Chip from '@mui/joy/Chip';
import Divider from '@mui/joy/Divider';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Link from '@mui/joy/Link';
import Input from '@mui/joy/Input';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import ModalClose from '@mui/joy/ModalClose';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Table from '@mui/joy/Table';
import Sheet from '@mui/joy/Sheet';
import Checkbox from '@mui/joy/Checkbox';
import IconButton, { iconButtonClasses } from '@mui/joy/IconButton';
import Typography from '@mui/joy/Typography';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import Dropdown from '@mui/joy/Dropdown';
// icons
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SearchIcon from '@mui/icons-material/Search';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import BlockIcon from '@mui/icons-material/Block';
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import { deleteConversation, selectConversations } from './ConversationsSlice';
import { useDispatch, useSelector } from 'react-redux';
import { ReactElement } from 'react';
import { Link as RouterLink } from 'react-router-dom';

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function RowMenu({ rowId }) {
  const dispatch = useDispatch();
  const handleDeleteConversation = (): void => {
    // dispatch(conversationDeleted(rowId));
    dispatch(deleteConversation(rowId));
  };

  return (
    <Dropdown>
      <MenuButton
        slots={{ root: IconButton }}
        slotProps={{ root: { variant: 'plain', color: 'neutral', size: 'sm' } }}
      >
        <MoreHorizRoundedIcon />
      </MenuButton>
      <Menu size="sm" sx={{ minWidth: 140 }}>
        <MenuItem>Edit</MenuItem>
        <MenuItem>Rename</MenuItem>
        <MenuItem>Move</MenuItem>
        <Divider />
        <MenuItem color="danger" onClick={handleDeleteConversation}>
          Delete
        </MenuItem>
      </Menu>
    </Dropdown>
  );
}

export default function ConversationTable(): ReactElement {
  const [order, setOrder] = React.useState<Order>('desc');
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [open, setOpen] = React.useState(false);

  const conversations = useSelector(selectConversations);

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
            '--TableCell-headBackground': 'var(--joy-palette-background-level1)',
            '--Table-headerUnderlineThickness': '1px',
            '--TableRow-hoverBackground': 'var(--joy-palette-background-level1)',
            '--TableCell-paddingY': '4px',
            '--TableCell-paddingX': '8px',
            mt: 5,
          }}
        >
          <thead>
            <tr>
              <th style={{ width: 48, textAlign: 'center', padding: '12px 6px' }}>
                <Checkbox
                  size="sm"
                  indeterminate={selected.length > 0 && selected.length !== conversations.length}
                  checked={selected.length === conversations.length}
                  onChange={(event) => {
                    setSelected(event.target.checked ? conversations.map((row) => row.id) : []);
                  }}
                  color={
                    selected.length > 0 || selected.length === conversations.length
                      ? 'primary'
                      : undefined
                  }
                  sx={{ verticalAlign: 'text-bottom' }}
                />
              </th>
              <th style={{ width: 20, padding: '12px 6px' }}>
                <Link
                  underline="none"
                  color="primary"
                  component="button"
                  onClick={() => setOrder(order === 'asc' ? 'desc' : 'asc')}
                  fontWeight="lg"
                  endDecorator={<ArrowDropDownIcon />}
                  sx={{
                    '& svg': {
                      transition: '0.2s',
                      transform: order === 'desc' ? 'rotate(0deg)' : 'rotate(180deg)',
                    },
                  }}
                >
                  ID
                </Link>
              </th>
              <th style={{ width: 100, padding: '12px 6px' }}>Number of Messages</th>
              <th style={{ width: 100, padding: '12px 6px' }}>Participants</th>
              <th style={{ width: 50, padding: '12px 6px' }}> </th>
            </tr>
          </thead>
          <tbody>
            {stableSort(conversations, getComparator(order, 'id')).map((row) => (
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
                  <Typography level="body-xs">{row.id}</Typography>
                </td>
                <td>
                  <Typography level="body-xs">{row.messages?.length || 0}</Typography>
                </td>
                <td>
                  <Typography level="body-xs">
                    {Object.keys(row.participants).join(' ') || '—'}
                  </Typography>
                </td>
                <td>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Link level="body-xs" component={RouterLink} to={`/conversations/${row.id}`}>
                      View
                    </Link>
                    <RowMenu rowId={row.id} />
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
