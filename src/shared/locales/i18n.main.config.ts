import i18n from 'i18next';
import backend from 'i18next-fs-backend';
// On Mac, the folder for resources isn't
// in the same directory as Linux/Windows;
// https://www.electron.build/configuration/contents#extrafiles
import path from 'path';

import whitelist from './whitelist';

const isMac = process.platform === 'darwin';
const isDev = process.env.NODE_ENV === 'development';
const prependPath =
  isMac && !isDev ? path.join(process.resourcesPath, '..') : '.';

i18n.use(backend).init({
  backend: {
    loadPath: prependPath + '/src/shared/locales/{{lng}}/{{ns}}.json',
    addPath: prependPath + '/src/shared/locales/{{lng}}/{{ns}}.missing.json',
  },
  debug: false,
  namespace: 'translation',
  saveMissing: true,
  saveMissingTo: 'current',
  lng: 'en',
  fallbackLng: false, // set to false when generating translation files locally
  supportedLngs: whitelist.langs,
});

export default i18n;
