import { ReactElement, useEffect } from 'react';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink, useParams } from 'react-router-dom';

import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';

import log from 'electron-log/renderer';
import _ from 'lodash';

import { AppDispatch, RootState } from '../../store';
import { Order, getComparator, stableSort } from '../../utils/sort';
import CustomBreadcrumbs from '../layout/CustomBreadcrumbs';
import { fetchSocialCueGroup, selectSocialCueGroupById } from './SocialCueGroupSlice';

export default function SocialCueGroup(): ReactElement {
  const { socialCueGroupId } = useParams();
  const dispatch = useDispatch<AppDispatch>();

  const [order] = React.useState<Order>('desc');

  log.debug(`socialCueGroupId: ${socialCueGroupId}`);

  if (!socialCueGroupId) {
    return <div>Invalid SocialCueGroup ID</div>;
  }

  useEffect(() => {
    log.debug(`fetching socialCueGroup ${socialCueGroupId}`);
    dispatch(fetchSocialCueGroup({ id: socialCueGroupId }));
  }, [socialCueGroupId]);

  const socialCueGroup = useSelector((state: RootState) =>
    selectSocialCueGroupById(state, socialCueGroupId),
  );

  if (!socialCueGroup) {
    return <div>SocialCueGroup Not Found</div>;
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
        <Typography level="h2">Social Cue Group</Typography>
      </Box>

      <Typography sx={{}} level="title-md">
        Name
      </Typography>
      <Typography>{socialCueGroup.name}</Typography>
      <Typography sx={{ mt: 1 }} level="title-md">
        Description
      </Typography>
      <Typography>{socialCueGroup.description}</Typography>
    
    </>
  );
}
