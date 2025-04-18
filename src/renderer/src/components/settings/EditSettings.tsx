import {
  ChangeEvent,
  ReactElement,
  SyntheticEvent,
  useEffect,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { Autocomplete, FormControl, FormHelperText, FormLabel } from '@mui/joy';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Input from '@mui/joy/Input';
import Option from '@mui/joy/Option';
import Select from '@mui/joy/Select';
import Typography from '@mui/joy/Typography';

import { AppDispatch } from '@renderer/store';
import Language from '@shared/enums/Language';
import Model from '@shared/enums/Model';
import ModelProvider from '@shared/enums/ModelProvider';
import log from 'electron-log/renderer';
import capitalize from 'lodash.capitalize';

import CustomBreadcrumbs from '../layout/CustomBreadcrumbs';
import { selectCurrentUser } from '../user/UsersSlice';
import {
  editSetting,
  fetchSettings,
  selectSettingByEmail,
} from './SettingsSlice';

export const getNativeLanguageName = (code: string): string => {
  const nativeName = new Intl.DisplayNames([code], {
    type: 'language',
    localeMatcher: 'lookup',
  }).of(code);
  return capitalize(nativeName) || code;
};
const EditSettings = (): ReactElement => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const languages = Object.values(Language);
  const modelProviders = Object.values(ModelProvider);
  const models = Object.values(Model);

  const currentUser = useSelector(selectCurrentUser);
  if (!currentUser) return <div>Please log in !</div>;
  const settings = useSelector((state) =>
    selectSettingByEmail(state, currentUser),
  );

  const [apiKey, setApiKey] = useState(settings?.apiKey || '');
  const [apiKeyError, setApiKeyError] = useState(false);
  const [modelProvider, setModelProvider] = useState<ModelProvider>(
    settings?.modelProvider || ModelProvider.OpenAI,
  );
  const [model, setModel] = useState<Model>(settings?.model || Model.GPT_4O);
  const [language, setLanguage] = useState<Language>(
    settings?.language || Language.EN,
  );

  //avoid empty values when app starts
  useEffect(() => {
    if (currentUser) {
      dispatch(fetchSettings({ email: currentUser }));
    }
  }, [currentUser]);

  useEffect(() => {
    if (settings) {
      setApiKey(settings.apiKey);
      setModelProvider(settings.modelProvider);
      setModel(settings.model);
      setLanguage(settings.language);
    }
  }, [settings]);

  const handleChangeModelProvider = (
    event: SyntheticEvent | null,
    newValue: string | null,
  ): void => {
    if (newValue) setModelProvider(newValue);
  };

  const handleChangeModel = (
    event: SyntheticEvent | null,
    newValue: string | null,
  ): void => {
    if (newValue) setModel(newValue);
  };

  const handleChangeLanguage = (
    event: SyntheticEvent | null,
    newValue: string | null,
  ): void => {
    if (newValue) {
      setLanguage(newValue);
    }
  };

  const handleChangeApiKey = (event: ChangeEvent<HTMLInputElement>): void => {
    const value = event.target.value;
    setApiKey(value);
  };

  const handleEditSettings = async (): Promise<void> => {
    if (!currentUser) {
      console.error('No current user!');
      return;
    }

    if (!apiKey?.trim()) {
      setApiKeyError(true);
      console.error('API Key is required');
      return;
    }

    setApiKeyError(false);

    try {
      const { payload, type } = await dispatch(
        editSetting({
          email: currentUser,
          apiKey,
          modelProvider,
          model,
          language,
        }),
      );

      console.debug(type, payload);

      navigate('/settings');
    } catch (error) {
      log.error(`Error updating settings: ${error}`);
    }
  };

  const handleResetToDefaults = async (): Promise<void> => {
    const defaultSettings = {
      email: 'lnco@epfl.ch',
      apiKey: 'default key',
      modelProvider: ModelProvider.OpenAI,
      model: Model.GPT_4O,
      language: Language.EN,
    };

    try {
      await dispatch(editSetting(defaultSettings));
      navigate('/settings');
    } catch (error) {
      console.error('Error resetting settings:', error);
    }
  };

  return (
    <>
      <CustomBreadcrumbs />
      <Box
        sx={{
          display: 'flex',
          my: 1,
          gap: 1,
          flexDirection: 'row',
          alignItems: 'end',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        }}
      >
        <Button color="neutral" onClick={() => navigate(`/settings`)}>
          {t('Back')}
        </Button>

        <Button color="primary" onClick={handleEditSettings}>
          {t('Save')}
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
        <Typography level="h2">{t('Edit Settings')}</Typography>
      </Box>

      <FormControl>
        <FormLabel>{t('Select an AI provider.')}</FormLabel>
        <Select value={modelProvider} onChange={handleChangeModelProvider}>
          {modelProviders.map((provider) => (
            <Option value={provider} key={provider}>
              {provider}
            </Option>
          ))}
        </Select>
      </FormControl>
      <FormControl>
        <FormLabel>
          {t('Select a model to process and generate responses.')}
        </FormLabel>
        <Select value={model} onChange={handleChangeModel}>
          {models.map((localModel) => (
            <Option value={localModel} key={localModel}>
              {localModel}
            </Option>
          ))}
        </Select>
        <FormHelperText>
          {t('Models may vary in accuracy, speed and cost.')}
        </FormHelperText>
      </FormControl>

      <FormControl>
        <FormLabel>{t('Model provider API Key')}</FormLabel>
        <Input
          value={apiKey}
          onChange={handleChangeApiKey}
          error={apiKeyError}
        ></Input>
        {apiKeyError && (
          <FormHelperText sx={{ color: 'red' }}>
            {t('You must enter an API key.')}
          </FormHelperText>
        )}
        <FormHelperText>
          {t(
            `Your model API key is used to communicate with the AI provider's services.`,
          )}
        </FormHelperText>
      </FormControl>

      <FormControl>
        <FormLabel>{t('Language')}</FormLabel>
        <Autocomplete
          options={languages}
          getOptionLabel={(option) => getNativeLanguageName(option)}
          value={language}
          onChange={handleChangeLanguage}
        />
        <FormHelperText>
          {t('This is the language of the Botticelli interface.')}
        </FormHelperText>
      </FormControl>

      <Button color="danger" onClick={handleResetToDefaults}>
        {t('Reset to Default Settings')}
      </Button>
    </>
  );
};

export default EditSettings;
