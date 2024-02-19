import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { StyledEngineProvider } from '@mui/joy/styles';

import App from './App.tsx';
import Agent from './components/agent/Agent';
import Agents from './components/agent/Agents';
import NewAgent from './components/agent/NewAgent';
import ArtificialAssistant from './components/agent/artificial/assistant/ArtificialAssistant';
import ArtificialAssistants from './components/agent/artificial/assistant/ArtificialAssistants';
import NewArtificialAssistant from './components/agent/artificial/assistant/NewArtificialAssistant';
import ArtificialEvaluator from './components/agent/artificial/evaluator/ArtificialEvaluator';
import ArtificialEvaluators from './components/agent/artificial/evaluator/ArtificialEvaluators';
import NewArtificialEvaluator from './components/agent/artificial/evaluator/NewArtificialEvaluator';
import ArtificialParticipant from './components/agent/artificial/participant/ArtificialParticipant';
import ArtificialParticipants from './components/agent/artificial/participant/ArtificialParticipants';
import NewArtificialParticipant from './components/agent/artificial/participant/NewArtificialParticipant';
import HumanAssistant from './components/agent/human/assistant/HumanAssistant';
import HumanAssistants from './components/agent/human/assistant/HumanAssistants';
import NewHumanAssistant from './components/agent/human/assistant/NewHumanAssistant';
import HumanParticipant from './components/agent/human/participant/HumanParticipant';
import HumanParticipants from './components/agent/human/participant/HumanParticipants';
import NewHumanParticipant from './components/agent/human/participant/NewHumanParticipant';
import Exchange from './components/exchange/Exchange.tsx';
import ExchangeTemplate from './components/exchange/ExchangeTemplate';
import ExchangeTemplates from './components/exchange/ExchangeTemplates';
import Exchanges from './components/exchange/Exchanges.tsx';
import NewExchangeTemplate from './components/exchange/NewExchangeTemplate';
import Experiment from './components/experiment/Experiment';
import Experiments from './components/experiment/Experiments';
import NewExperiment from './components/experiment/NewExperiment';
import Interaction from './components/interaction/Interaction';
import InteractionTemplate from './components/interaction/InteractionTemplate';
import InteractionTemplates from './components/interaction/InteractionTemplates';
import Interactions from './components/interaction/Interactions';
import NewInteraction from './components/interaction/NewInteraction';
import NewInteractionTemplate from './components/interaction/NewInteractionTemplate';
import ParticipantInteraction from './components/interaction/ParticipantInteraction';
import NewTrigger from './components/trigger/NewTrigger';
import Trigger from './components/trigger/Trigger';
import Triggers from './components/trigger/Triggers';
import './index.css';
import store from './store';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: 'experiments',
        element: <Experiments />,
      },
      {
        path: 'experiments/new',
        element: <NewExperiment />,
      },
      {
        path: 'experiments/:experimentId',
        element: <Experiment />,
      },
      {
        path: 'exchanges',
        element: <Exchanges />,
      },
      {
        path: 'exchanges/:exchangeId',
        element: <Exchange />,
      },
      {
        path: 'exchanges/templates',
        element: <ExchangeTemplates />,
      },
      {
        path: 'exchanges/templates/new',
        element: <NewExchangeTemplate />,
      },
      {
        path: 'exchanges/templates/:exchangeTemplateId',
        element: <ExchangeTemplate />,
      },
      {
        path: 'interactions',
        element: <Interactions />,
      },
      {
        path: 'interactions/new',
        element: <NewInteraction />,
      },
      {
        path: 'interactions/:interactionId',
        element: <Interaction />,
      },
      {
        path: 'interactions/templates',
        element: <InteractionTemplates />,
      },
      {
        path: 'interactions/templates/new',
        element: <NewInteractionTemplate />,
      },
      {
        path: 'interactions/templates/:interactionTemplateId',
        element: <InteractionTemplate />,
      },
      {
        path: 'triggers',
        element: <Triggers />,
      },
      {
        path: 'triggers/new',
        element: <NewTrigger />,
      },
      {
        path: 'triggers/:triggerId',
        element: <Trigger />,
      },
      {
        path: 'agents',
        element: <Agents />,
      },
      {
        path: 'agents/new',
        element: <NewAgent />,
      },
      {
        path: 'agents/:agentId',
        element: <Agent />,
      },
      // artificial assistants
      {
        path: 'agents/artificial/assistants',
        element: <ArtificialAssistants />,
      },
      {
        path: 'agents/artificial/assistants/new',
        element: <NewArtificialAssistant />,
      },
      {
        path: 'agents/artificial/assistants/:agentId',
        element: <ArtificialAssistant />,
      },
      // artificial participants
      {
        path: 'agents/artificial/participants',
        element: <ArtificialParticipants />,
      },
      {
        path: 'agents/artificial/participants/new',
        element: <NewArtificialParticipant />,
      },
      {
        path: 'agents/artificial/participants/:agentId',
        element: <ArtificialParticipant />,
      },
      // artificial evaluators
      {
        path: 'agents/artificial/evaluators',
        element: <ArtificialEvaluators />,
      },
      {
        path: 'agents/artificial/evaluators/new',
        element: <NewArtificialEvaluator />,
      },
      {
        path: 'agents/artificial/evaluators/:agentId',
        element: <ArtificialEvaluator />,
      },
      // human assistants
      {
        path: 'agents/human/assistants',
        element: <HumanAssistants />,
      },
      {
        path: 'agents/human/assistants/new',
        element: <NewHumanAssistant />,
      },
      {
        path: 'agents/human/assistants/:agentId',
        element: <HumanAssistant />,
      },
      // human participants
      {
        path: 'agents/human/participants',
        element: <HumanParticipants />,
      },
      {
        path: 'agents/human/participants/new',
        element: <NewHumanParticipant />,
      },
      {
        path: 'agents/human/participants/:agentId',
        element: <HumanParticipant />,
      },
    ],
  },
  {
    path: '/experiments/:experimentId/participants/:participantId/interactions/:interactionId',
    element: <ParticipantInteraction />,
  },
]);

console.log('loading');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <StyledEngineProvider injectFirst>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </StyledEngineProvider>
  </React.StrictMode>,
);
