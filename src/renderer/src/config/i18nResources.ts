import { whitelistKeys } from '@shared/locales/whitelist';
import i18n from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';

i18n
  .use(
    resourcesToBackend(
      (language, namespace) =>
        import(`../../../shared/locales/${language}/${namespace}.json`),
    ),
  )
  .on('failedLoading', (lng, ns, msg) => console.error(msg))
  .init({
    debug: true,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  });

i18n.languages = whitelistKeys;

export default i18n;
