import { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

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
  editPath?: string;
};
/**
 * Renders a dropdown menu with "Edit" and "Delete" options for a row.
 *
 * The component displays a menu button that, when clicked, opens a dropdown containing
 * an "Edit" option and a "Delete" option. Selecting "Edit" navigates to the provided edit path,
 * and selecting "Delete" triggers the deletion process for the row identified by rowId.
 *
 * @param rowId - The identifier of the row.
 * @param deleteHandler - Function to call for deleting the row.
 * @param editPath - Optional path to navigate to the edit view.
 *
 * @returns The dropdown menu as a React element.
 */
export default function RowMenu({
  rowId,
  deleteHandler,
  editPath,
}: Props): ReactElement {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();
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
        <MenuItem onClick={() => navigate(editPath)}>{t('Edit')}</MenuItem>
        <Divider />
        <MenuItem color="danger" onClick={handleDelete}>
          {t('Delete')}
        </MenuItem>
      </Menu>
    </Dropdown>
  );
}
