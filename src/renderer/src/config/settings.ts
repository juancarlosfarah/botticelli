// default settings object
import {
  GeneralSettings,
  GeneralSettingsKeys,
} from '@shared/interfaces/Settings';

export const DEFAULT_ALLOW_REPLIES_SETTING = true;
export const DEFAULT_ALLOW_REPORTING = true;
export const DEFAULT_MAX_MESSAGE_LENGTH_SETTING = 300;

export const DEFAULT_GENERAL_SETTINGS: GeneralSettings = {
  [GeneralSettingsKeys.AllowReplies]: DEFAULT_ALLOW_REPLIES_SETTING,
  [GeneralSettingsKeys.AllowReporting]: DEFAULT_ALLOW_REPORTING,
  [GeneralSettingsKeys.MaxMessageLength]: DEFAULT_MAX_MESSAGE_LENGTH_SETTING,
};
