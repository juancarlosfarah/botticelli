import { ReactElement, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Option from '@mui/joy/Option';
import Select from '@mui/joy/Select';
import Typography from '@mui/joy/Typography';

import { AppDispatch, RootState } from '@renderer/store';
import Model from '@shared/enums/Model';

import CustomBreadcrumbs from '../layout/CustomBreadcrumbs';
import { selectCurrentUser } from '../user/UsersSlice';
import { getNativeLanguageName } from './EditSettings';
import { fetchSettings, selectSettingByEmail } from './SettingsSlice';

const Settings = (): ReactElement => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const currentUser = useSelector(selectCurrentUser);

  const setting = useSelector((state: RootState) =>
    selectSettingByEmail(state, currentUser),
  );

  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);

  useEffect(() => {
    if (currentUser) {
      dispatch(fetchSettings({ email: currentUser }));
    }
  }, [dispatch, currentUser]);

  useEffect(() => {
    setSelectedLanguage(i18n.language);
  }, [i18n.language]);

  const handleLanguageChange = (_: any, value: string | null) => {
    if (!value) return;
    i18n.changeLanguage(value);
    setSelectedLanguage(value);
  };

  const defaultSetting = {
    apiKey: '',
    modelProvider: 'OpenAI',
    model: Model.GPT_4O,
    language: i18n.language || 'en',
  };
  const effectiveSetting = setting ?? defaultSetting;

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
        {currentUser && (
          <Button color="primary" to="/settings/edit" component={RouterLink}>
            {t('Edit')}
          </Button>
        )}
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

      <Typography level="title-md">{t('User')}</Typography>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Typography>{currentUser ?? t('Not Logged In')}</Typography>
        {!currentUser && (
          <Button size="sm" onClick={() => navigate('/login')}>
            {t('Login')}
          </Button>
        )}
      </Box>

      <Typography level="title-md" sx={{ mt: 2 }}>
        {t('Language')}
      </Typography>
      <Select
        size="sm"
        value={selectedLanguage}
        onChange={handleLanguageChange}
        sx={{ mt: 1, maxWidth: 200 }}
      >
        {['en', 'fr'].map((lang) => (
          <Option key={lang} value={lang}>
            {getNativeLanguageName(lang)}
          </Option>
        ))}
      </Select>

      {currentUser && (
        <>
          <Typography level="title-md" sx={{ mt: 2 }}>
            {t('OpenAI API Key')}
          </Typography>
          <Typography>
            {effectiveSetting.apiKey
              ? '••••••••' + effectiveSetting.apiKey.slice(-4)
              : t('Not Set')}
          </Typography>

          <Typography level="title-md" sx={{ mt: 2 }}>
            {t('Model Provider')}
          </Typography>
          <Typography>{effectiveSetting.modelProvider}</Typography>

          <Typography level="title-md" sx={{ mt: 2 }}>
            {t('Model')}
          </Typography>
          <Typography>{effectiveSetting.model}</Typography>
        </>
      )}
    </div>
  );
};

export default Settings;
