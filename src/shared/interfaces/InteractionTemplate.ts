import ExchangeTemplate from './ExchangeTemplate';

type InteractionTemplate = {
  id: string;
  description: string;
  instructions: string;
  name: string;
  exchangeTemplates: ExchangeTemplate[];
};

export default InteractionTemplate;
