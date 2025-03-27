import { ReactElement, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';

import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Typography from '@mui/joy/Typography';

import { AppDispatch } from '@renderer/store';

import CustomBreadcrumbs from '../layout/CustomBreadcrumbs';
import { selectCurrentUser } from '../user/UsersSlice';
import { getNativeLanguageName } from './EditSettings';
import { fetchSettings, selectSettingByUserEmail } from './SettingsSlice';

const Settings = (): ReactElement => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  const currentUser = useSelector(selectCurrentUser);

  const setting = useSelector((state) =>
    selectSettingByUserEmail(state, currentUser),
  );

  useEffect(() => {
    if (currentUser) {
      dispatch(fetchSettings({ userEmail: currentUser }));
    }
  }, [dispatch, currentUser]);

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
        {t('User')}
      </Typography>
      <Typography>{setting?.userEmail}</Typography>

      <Typography sx={{}} level="title-md">
        {t('OpenAI API Key')}
      </Typography>
      <Typography>
        {setting?.apiKey ? '••••••••' + setting.apiKey.slice(-4) : ''}
      </Typography>

      <Typography sx={{ mt: 1 }} level="title-md">
        {t('Language')}
      </Typography>
      <Typography>
        {setting?.language ? getNativeLanguageName(setting.language) : '-'}
      </Typography>

      <Typography sx={{ mt: 1 }} level="title-md">
        {t('Model Provider')}
      </Typography>
      <Typography>{setting?.modelProvider}</Typography>

      <Typography sx={{ mt: 1 }} level="title-md">
        {t('Model')}
      </Typography>
      <Typography>{setting?.model}</Typography>
    </div>
  );
};

export default Settings;
