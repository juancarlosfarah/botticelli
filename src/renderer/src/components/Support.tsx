import { ReactElement } from 'react';

import { Box, Typography } from '@mui/joy';

export default function Support(): ReactElement {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'center',
      }}
    >
      <Typography level="h1" sx={{ mb: 2 }}>
        the support page
      </Typography>
    </Box>
  );
}
