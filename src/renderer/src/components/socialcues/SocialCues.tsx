import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';

import Button from '@mui/joy/Button';

import { AppDispatch } from '../../store.ts';
import SocialCueList from './SocialCuesList.tsx';
import SocialCueTable from './SocialCueTable.tsx';
import { fetchSocialCues } from './SocialCuesSlice.ts';

export default function SocialCues(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchSocialCues());
  }, []);

  return (
    <div>
      <Button color="primary" to="/socialcues
      /new" component={RouterLink}>
        New SocialCue
      </Button>
      <SocialCueTable />
      <SocialCueList />
    </div>
  );
}
