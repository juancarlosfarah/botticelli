import Language from '@shared/enums/Language';
import Model from '@shared/enums/Model';
import ModelProvider from '@shared/enums/ModelProvider';

type Setting = {
  modelProvider: ModelProvider;
  model: Model;
  apiKey: string;
  language: Language;
};

export type PatchOneSettingParams = {
  modelProvider: ModelProvider;
  model: Model;
  apiKey: string;
  language?: Language;
};

export default Setting;
