import InteractionTemplateExchangeTemplate from './InteractionTemplateExchangeTemplate';

type InteractionTemplate = {
  id: string;
  name: string;
  description: string;
  modelInstructions: string;
  participantInstructions: string;
  participantInstructionsOnComplete: string;
  exchangeTemplates: InteractionTemplateExchangeTemplate[];
};

export type PostOneInteractionTemplateParams = {
  name: string;
  description: string;
  modelInstructions: string;
  participantInstructions: string;
  participantInstructionsOnComplete: string;
  // ids of exchange templates
  exchangeTemplates: string[];
};

export type PostOneInteractionTemplateResponse = InteractionTemplate;

export type GetManyInteractionTemplatesResponse = InteractionTemplate[];

export type GetOneInteractionTemplateResponse = InteractionTemplate;

export type GetOneInteractionTemplateParams = {
  id: string;
};

export type DeleteOneInteractionTemplateParams = string;

export default InteractionTemplate;
