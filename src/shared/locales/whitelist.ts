// Contains a whitelist of languages for our app
export const whitelistMap = {
  en: 'English',
  fr: 'Français', // French
  // de: 'Deutsche', // German
  // ja: '日本語' // Japanese
  // af: 'Afrikaans', //Afrikaans
  // ar: 'عربى', // Arabic
  // am: 'አማርኛ', // Amharic
  // bg: 'български', // Bulgarian
  // ca: 'Català', // Catalan
  // cs: 'čeština', // Czech
  // da: 'Dansk', // Danish
  // el: 'Ελληνικά', // Greek
  // es: 'Español', // Spanish
  // et: 'Eestlane', // Estonian
  // fa: 'فارسی', // Persian
  // fi: 'Suomalainen', // Finnish
  // fil: 'Pilipino', // Filipino
  // gu: 'ગુજરાતી', // Gujarati
  // he: 'עברית', // Hebrew
  // hi: 'हिंदी', // Hindi
  // hr: 'Hrvatski', // Croatian
  // hu: 'Magyar', // Hungarian
  // id: 'Indonesia', // Indonesian
  // it: 'Italiano', // Italian
  // kn: 'ಕನ್ನಡ', // Kannada
  // ko: '한국어', // Korean
  // lt: 'Lietuvis', // Lithuanian
  // lv: 'Latvietis', // Latvian
  // ml: 'മലയാളം', // Malayalam
  // mr: 'मराठी', // Marathi
  // ms: 'Melayu', // Malay
  // nl: 'Nederlands', // Dutch
  // no: 'norsk', // Norwegian
  // pl: 'Polskie', // Polish
  // pt: 'Português', // Portuguese
  // ro: 'Română', // Romanian
  // ru: 'Pусский', // Russian
  // sk: 'Slovenský', // Slovak
  // sr: 'Српски', // Serbian
  // sv: 'Svenska', // Swedish
  // sw: 'Kiswahili', // Swahili
  // ta: 'தமிழ்', // Tamil
  // te: 'తెలుగు', // Telugu
  // th: 'ไทย', // Thai
  // tr: 'Türk', // Turkish
  // uk: 'Українська', // Ukranian
  // vi: 'Tiếng Việt', // Vietnamese
  // zh_CN: '简体中文' // Chinese
};

export const whitelistKeys = Object.keys(whitelistMap);

const whitelist = (function () {
  const keys = whitelistKeys;
  const clickFunction = function (channel, lng, i18nextMainBackend) {
    return function (menuItem, browserWindow, event) {
      // Solely within the top menu
      i18nextMainBackend.changeLanguage(lng);

      // Between renderer > main process
      browserWindow.webContents.send(channel, {
        lng,
      });
    };
  };

  return {
    langs: keys,
    buildSubmenu: function (channel, i18nextMainBackend) {
      let submenu = [];

      for (const key of keys) {
        submenu.push({
          label: whitelistMap[key],
          click: clickFunction(channel, key, i18nextMainBackend),
        });
      }

      return submenu;
    },
  };
})();

export default whitelist;
