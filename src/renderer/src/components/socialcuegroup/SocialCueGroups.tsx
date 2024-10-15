import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';

import Button from '@mui/joy/Button';

import { AppDispatch } from '../../store.ts';
import SocialCueGroupList from './SocialCueGroupList.tsx';
import SocialCueGroupTable from './SocialCueGroupTable.tsx';
import { fetchSocialCueGroups } from './SocialCueGroupSlice.ts';

export default function SocialCueGroups(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchSocialCueGroups());
  }, []);

  return (
    <div>
      <Button color="primary" to="/socialcuegroups/new" component={RouterLink}>
        New SocialCueGroup
      </Button>
      <SocialCueGroupTable />
      <SocialCueGroupList />
    </div>
  );
}
