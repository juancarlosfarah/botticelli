import ExchangeTemplate from './ExchangeTemplate';
import InteractionTemplate from './InteractionTemplate';

type InteractionTemplateExchangeTemplate = {
  id: string;
  order: number;
  exchangeTemplate: ExchangeTemplate;
  interactionTemplate: InteractionTemplate;
  email?: string;
};

export default InteractionTemplateExchangeTemplate;
