import { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';

import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Typography from '@mui/joy/Typography';

import CustomBreadcrumbs from '../layout/CustomBreadcrumbs';

const Settings = (): ReactElement => {
  const { t } = useTranslation();

  return (
    <div>
      <CustomBreadcrumbs />
      <Box
        sx={{
          display: 'flex',
          my: 1,
          gap: 1,
          flexDirection: 'row',
          alignItems: 'end',
          flexWrap: 'wrap',
          justifyContent: 'end',
        }}
      >
        <Button color="primary" to="/settings/edit" component={RouterLink}>
          {t('Edit')}
        </Button>
      </Box>
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
        <Typography level="h2">{t('Settings')}</Typography>
      </Box>

      <Typography sx={{}} level="title-md">
        {t('OpenAI API Key')}
      </Typography>
      <Typography>*****</Typography>

      <Typography sx={{ mt: 1 }} level="title-md">
        {t('Language')}
      </Typography>
      <Typography>Current Language</Typography>
    </div>
  );
};

export default Settings;
