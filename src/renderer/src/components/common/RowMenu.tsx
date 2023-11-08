import { ReactElement } from 'react';
import { useDispatch } from 'react-redux';

import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import Divider from '@mui/joy/Divider';
import Dropdown from '@mui/joy/Dropdown';
import IconButton from '@mui/joy/IconButton';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';

type Props = {
  rowId: string | number;
  // todo: proper type
  deleteHandler: Function;
};
export default function RowMenu({ rowId, deleteHandler }: Props): ReactElement {
  const dispatch = useDispatch();
  const handleDelete = (): void => {
    dispatch(deleteHandler(rowId));
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
        <MenuItem color="danger" onClick={handleDelete}>
          Delete
        </MenuItem>
      </Menu>
    </Dropdown>
  );
}
