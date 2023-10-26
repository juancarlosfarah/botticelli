// known problem with date-fns:
// https://stackoverflow.com/questions/63375527/how-to-set-up-imported-multiple-times-rule-for-date-fns-in-eslint
import { formatDistance } from 'date-fns';
import { enGB, fr } from 'date-fns/locale';

// to add a new language to the dates
const locales: { [key: string]: Locale } = {
  fr,
  en: enGB,
};

export const NO_DATE_PLACEHOLDER = 'N.D.';

const getFormattedTime = (time: string, lang: string): string => {
  const parsedInputDate = Date.parse(time);

  return Number.isNaN(parsedInputDate)
    ? NO_DATE_PLACEHOLDER
    : formatDistance(parsedInputDate, new Date(), {
        includeSeconds: true,
        addSuffix: true, // adds "ago" at the end
        locale: locales[lang], // provides localization
      });
};

export { getFormattedTime };
