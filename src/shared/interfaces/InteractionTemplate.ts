import ExchangeTemplate from './ExchangeTemplate';

type InteractionTemplate = {
  id: string;
  name: string;
  description: string;
  modelInstructions: string;
  participantInstructions: string;
  exchangeTemplates: ExchangeTemplate[];
};

export type InteractionTemplateParams = {
  name: string;
  description: string;
  modelInstructions: string;
  participantInstructions: string;
  exchangeTemplates: ExchangeTemplate[];
};

export default InteractionTemplate;
