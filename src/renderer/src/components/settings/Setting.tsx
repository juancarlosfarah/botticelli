import { ReactElement, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';

import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Typography from '@mui/joy/Typography';

import { AppDispatch } from '@renderer/store';
import capitalize from 'lodash.capitalize';

import CustomBreadcrumbs from '../layout/CustomBreadcrumbs';
import { fetchSettings, selectSettingByUsername } from './SettingsSlice';

const Settings = (): ReactElement => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  const username = 'lnco@epfl.ch';
  const setting = useSelector(selectSettingByUsername(username));

  const getNativeLanguageName = (code: string): string => {
    const nativeName = new Intl.DisplayNames([code], {
      type: 'language',
      localeMatcher: 'lookup',
    }).of(code);
    return capitalize(nativeName) || code;
  };

  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

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
      <Typography>{setting?.apiKey}</Typography>

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
