import Language from '@shared/enums/Language';
import Model from '@shared/enums/Model';
import ModelProvider from '@shared/enums/ModelProvider';
import User from '@shared/enums/User';

type Setting = {
  username: User;
  modelProvider: ModelProvider;
  model: Model;
  apiKey: string;
  language: Language;
};

export type PatchOneSettingParams = {
  username: User;
  modelProvider: ModelProvider;
  model: Model;
  apiKey: string;
  language?: Language;
};

export default Setting;
