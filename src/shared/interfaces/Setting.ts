import Language from '@shared/enums/Language';
import Model from '@shared/enums/Model';
import ModelProvider from '@shared/enums/ModelProvider';

type Setting = {
  userEmail: string;
  modelProvider: ModelProvider;
  model: Model;
  apiKey: string;
  language: Language;
};

export type PatchOneSettingParams = {
  userEmail: string;
  modelProvider: ModelProvider;
  model: Model;
  apiKey: string;
  language?: Language;
};

export default Setting;
