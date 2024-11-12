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
import { ColorPaletteProp } from '@mui/joy/styles';

import log from 'electron-log/renderer';
import _ from 'lodash';

import { AppDispatch, RootState } from '../../store';
import { Order, getComparator, stableSort } from '../../utils/sort';
import CustomBreadcrumbs from '../layout/CustomBreadcrumbs';
import { fetchSocialCue, selectSocialCueById } from './SocialCuesSlice';

export default function SocialCue(): ReactElement {
  const { socialCueId } = useParams();
  const dispatch = useDispatch<AppDispatch>();

  const [order] = React.useState<Order>('desc');

  log.debug(`socialCueId: ${socialCueId}`);

  if (!socialCueId) {
    return <div>Invalid SocialCue ID</div>;
  }

  useEffect(() => {
    log.debug(`fetching socialCue ${socialCueId}`);
    dispatch(fetchSocialCue({ id: socialCueId }));
  }, [socialCueId]);

  const socialCue = useSelector((state: RootState) =>
    selectSocialCueById(state, socialCueId),
  );

  if (!socialCue) {
    return <div>SocialCue Not Found</div>;
  }

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
        <Typography level="h2">SocialCue</Typography>
      </Box>

      <Typography sx={{}} level="title-md">
        Name
      </Typography>
      <Typography>{socialCue.name}</Typography>

      <Typography sx={{ mt: 1 }} level="title-md">
        Group
      </Typography>
      <Typography>{socialCue.group}</Typography>
      <Typography sx={{ mt: 1 }} level="title-md">
        Formulation
      </Typography>
      <Typography>{socialCue.formulation}</Typography>
      <Typography sx={{ mt: 1 }} level="title-md">
        Description
      </Typography>
      <Typography>{socialCue.description}</Typography>
    
    </>
  );
}
