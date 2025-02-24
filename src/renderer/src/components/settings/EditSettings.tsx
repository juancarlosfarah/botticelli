import { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { FormControl, FormHelperText, FormLabel } from '@mui/joy';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Input from '@mui/joy/Input';
import Option from '@mui/joy/Option';
import Select from '@mui/joy/Select';
import Typography from '@mui/joy/Typography';

import Language from '@shared/enums/Language';
import ModelKey from '@shared/enums/ModelKey';
import capitalize from 'lodash.capitalize';

import CustomBreadcrumbs from '../layout/CustomBreadcrumbs';

const EditSettings = (): ReactElement => {
  const { t } = useTranslation();

  const languages = Object.values(Language);
  const models = Object.values(ModelKey);

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
          justifyContent: 'end',
        }}
      >
        <Button color="primary" onClick={() => {}}>
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
        <FormLabel>
          {t('Select an AI model to process and generate responses.')}
        </FormLabel>
        <Select value={''} onChange={() => {}}>
          {models.map((model) => (
            <Option value={model} key={model}>
              {model}
            </Option>
          ))}
        </Select>
        <FormHelperText>
          {t('Models may vary in accuracy, speed and cost.')}
        </FormHelperText>
      </FormControl>

      <FormControl>
        <FormLabel>{t('OpenAI API Key')}</FormLabel>
        <Input value={''} onChange={() => {}}></Input>
        <FormHelperText>
          {t(
            `Your OpenAI API key is used to communicate with the OpenAI services.`,
          )}
        </FormHelperText>
      </FormControl>

      <FormControl>
        <FormLabel> {t('Language')}</FormLabel>
        <Select value={''} onChange={() => {}}>
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

      <Button color="danger" onClick={() => {}}>
        {t('Reset to Default Settings')}
      </Button>
    </>
  );
};

export default EditSettings;
