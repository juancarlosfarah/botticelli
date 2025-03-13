import {
  ChangeEvent,
  ReactElement,
  SyntheticEvent,
  useEffect,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { FormControl, FormHelperText, FormLabel } from '@mui/joy';
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
import capitalize from 'lodash.capitalize';

import CustomBreadcrumbs from '../layout/CustomBreadcrumbs';
import {
  editSetting,
  fetchSettings,
  selectApiKey,
  selectLanguage,
  selectModel,
  selectModelProvider,
} from './SettingsSlice';

const EditSettings = (): ReactElement => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const languages = Object.values(Language);
  const modelProviders = Object.values(ModelProvider);
  const models = Object.values(Model);

  const apiKey = useSelector(selectApiKey);
  const modelProvider = useSelector(selectModelProvider);
  const model = useSelector(selectModel);
  const language = useSelector(selectLanguage);

  const [localApiKey, setApiKey] = useState(apiKey);
  const [localModelProvider, setModelProvider] = useState(modelProvider);
  const [localModel, setModel] = useState(model);
  const [localLanguage, setLanguage] = useState(language);

  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  useEffect(() => {
    setApiKey(apiKey);
    setModelProvider(modelProvider);
    setModel(model);
    setLanguage(language);
  }, [apiKey, modelProvider, model, language]);

  const handleChangeModelProvider = (
    _event: SyntheticEvent | null,
    newValue: string | null,
  ): void => {
    if (newValue) setModelProvider(newValue);
  };

  const handleChangeModel = (
    _event: SyntheticEvent | null,
    newValue: string | null,
  ): void => {
    if (newValue) setModel(newValue);
  };

  const handleChangeLanguage = (
    _event: SyntheticEvent | null,
    newValue: string | null,
  ): void => {
    if (newValue) setLanguage(newValue);
  };

  const handleChangeApiKey = (event: ChangeEvent<HTMLInputElement>): void => {
    setApiKey(event.target.value);
  };

  const handleEditSettings = async (): Promise<void> => {
    await dispatch(editSetting({ name: 'apiKey', value: localApiKey }));
    await dispatch(
      editSetting({ name: 'modelProvider', value: localModelProvider }),
    );
    await dispatch(editSetting({ name: 'model', value: localModel }));
    await dispatch(editSetting({ name: 'language', value: localLanguage }));

    navigate('/settings');
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
        <Select value={localModelProvider} onChange={handleChangeModelProvider}>
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
        <Select value={localModel} onChange={handleChangeModel}>
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
        <Input value={localApiKey} onChange={handleChangeApiKey}></Input>
        <FormHelperText>
          {t(
            `Your model API key is used to communicate with the AI provider's services.`,
          )}
        </FormHelperText>
      </FormControl>

      <FormControl>
        <FormLabel> {t('Language')}</FormLabel>
        <Select value={localLanguage} onChange={handleChangeLanguage}>
          {languages.map((language) => (
            <Option value={language} key={language}>
              {capitalize(language)}
            </Option>
          ))}
        </Select>
        <FormHelperText>
          {t('This is the language of the Botticelli interface.')}
        </FormHelperText>
      </FormControl>

      <Button color="danger" onClick={() => dispatch(fetchSettings())}>
        {t('Reset to Default Settings')}
      </Button>
    </>
  );
};

export default EditSettings;
