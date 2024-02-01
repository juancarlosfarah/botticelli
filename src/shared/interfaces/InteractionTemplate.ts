import InteractionTemplateExchangeTemplate from './InteractionTemplateExchangeTemplate';

type InteractionTemplate = {
  id: string;
  name: string;
  description: string;
  modelInstructions: string;
  participantInstructions: string;
  exchangeTemplates: InteractionTemplateExchangeTemplate[];
};

export type InteractionTemplateParams = {
  name: string;
  description: string;
  modelInstructions: string;
  participantInstructions: string;
  // ids of exchange templates
  exchangeTemplates: string[];
};

export default InteractionTemplate;
