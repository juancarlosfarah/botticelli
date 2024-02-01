import ExchangeTemplate from './ExchangeTemplate';
import InteractionTemplate from './InteractionTemplate';

type InteractionTemplateExchangeTemplate = {
  id: string;
  order: number;
  exchangeTemplate: ExchangeTemplate;
  interactionTemplate: InteractionTemplate;
};

export default InteractionTemplateExchangeTemplate;
