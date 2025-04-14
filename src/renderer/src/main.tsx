import React from 'react';
import ReactDOM from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { StyledEngineProvider } from '@mui/joy/styles';

import App from './App.tsx';
import Home from './components/Home';
import RequireAuth from './components/RequireAuth';
import Support from './components/Support';
import ArtificialAssistant from './components/agent/artificial/assistant/ArtificialAssistant';
import ArtificialAssistants from './components/agent/artificial/assistant/ArtificialAssistants';
import EditArtificialAssistant from './components/agent/artificial/assistant/EditArtificialAssistant';
import NewArtificialAssistant from './components/agent/artificial/assistant/NewArtificialAssistant';
import ArtificialEvaluator from './components/agent/artificial/evaluator/ArtificialEvaluator';
import ArtificialEvaluators from './components/agent/artificial/evaluator/ArtificialEvaluators';
import EditArtificialEvaluator from './components/agent/artificial/evaluator/EditArtificialEvaluator.tsx';
import NewArtificialEvaluator from './components/agent/artificial/evaluator/NewArtificialEvaluator';
import ArtificialParticipant from './components/agent/artificial/participant/ArtificialParticipant';
import ArtificialParticipants from './components/agent/artificial/participant/ArtificialParticipants';
import EditArtificialParticipant from './components/agent/artificial/participant/EditArtificialParticipant.tsx';
import NewArtificialParticipant from './components/agent/artificial/participant/NewArtificialParticipant';
import EditHumanAssistant from './components/agent/human/assistant/EditHumanAssistant.tsx';
import HumanAssistant from './components/agent/human/assistant/HumanAssistant';
import HumanAssistants from './components/agent/human/assistant/HumanAssistants';
import NewHumanAssistant from './components/agent/human/assistant/NewHumanAssistant';
import EditHumanParticipant from './components/agent/human/participant/EditHumanParticipant.tsx';
import HumanParticipant from './components/agent/human/participant/HumanParticipant';
import HumanParticipants from './components/agent/human/participant/HumanParticipants';
import NewHumanParticipant from './components/agent/human/participant/NewHumanParticipant';
import EditExchangeTemplate from './components/exchange/EditExchangeTemplate.tsx';
import Exchange from './components/exchange/Exchange.tsx';
import ExchangeTemplate from './components/exchange/ExchangeTemplate';
import ExchangeTemplates from './components/exchange/ExchangeTemplates';
import Exchanges from './components/exchange/Exchanges.tsx';
import NewExchangeTemplate from './components/exchange/NewExchangeTemplate';
import Experiment from './components/experiment/Experiment';
import Experiments from './components/experiment/Experiments';
import NewExperiment from './components/experiment/NewExperiment';
import EditInteraction from './components/interaction/EditInteraction.tsx';
import EditInteractionTemplate from './components/interaction/EditInteractionTemplate.tsx';
import Interaction from './components/interaction/Interaction';
import InteractionTemplate from './components/interaction/InteractionTemplate';
import InteractionTemplates from './components/interaction/InteractionTemplates';
import Interactions from './components/interaction/Interactions';
import NewInteraction from './components/interaction/NewInteraction';
import NewInteractionTemplate from './components/interaction/NewInteractionTemplate';
import ParticipantInteraction from './components/interaction/ParticipantInteraction';
import EditSettings from './components/settings/EditSettings';
import Setting from './components/settings/Setting.tsx';
import NewSimulation from './components/simulation/NewSimulation';
import Simulation from './components/simulation/Simulation';
import Simulations from './components/simulation/Simulations';
import NewTrigger from './components/trigger/NewTrigger';
import Trigger from './components/trigger/Trigger';
import Triggers from './components/trigger/Triggers';
import Login from './components/user/Login.tsx';
import i18n from './config/i18nResources';
import './index.css';
import store from './store';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <App />,
    children: [
      { path: 'home', element: <Home /> },
      { path: 'support', element: <Support /> },

      {
        path: 'experiments',
        element: (
          <RequireAuth>
            <Experiments />
          </RequireAuth>
        ),
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
        element: (
          <RequireAuth>
            <ExchangeTemplates />
          </RequireAuth>
        ),
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
        path: 'exchanges/templates/:exchangeTemplateId/edit',
        element: <EditExchangeTemplate />,
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
        path: 'interactions/:interactionTemplateId/edit',
        element: <EditInteraction />,
      },

      {
        path: 'interactions/templates',
        element: (
          <RequireAuth>
            <InteractionTemplates />
          </RequireAuth>
        ),
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
        path: 'interactions/templates/:interactionTemplateId/edit',
        element: <EditInteractionTemplate />,
      },

      {
        path: 'triggers',
        element: (
          <RequireAuth>
            <Triggers />
          </RequireAuth>
        ),
      },

      {
        path: 'triggers/new',
        element: <NewTrigger />,
      },
      {
        path: 'triggers/:triggerId',
        element: <Trigger />,
      },
      // artificial assistants
      {
        path: 'agents/artificial/assistants',
        element: (
          <RequireAuth>
            <ArtificialAssistants />
          </RequireAuth>
        ),
      },

      {
        path: 'agents/artificial/assistants/new',
        element: <NewArtificialAssistant />,
      },
      {
        path: 'agents/artificial/assistants/:agentId',
        element: <ArtificialAssistant />,
      },
      {
        path: 'agents/artificial/assistants/:agentId/edit',
        element: <EditArtificialAssistant />,
      },
      // artificial participants
      {
        path: 'agents/artificial/participants',
        element: (
          <RequireAuth>
            <ArtificialParticipants />
          </RequireAuth>
        ),
      },

      {
        path: 'agents/artificial/participants/new',
        element: <NewArtificialParticipant />,
      },
      {
        path: 'agents/artificial/participants/:agentId',
        element: <ArtificialParticipant />,
      },
      {
        path: 'agents/artificial/participants/:agentId/edit',
        element: <EditArtificialParticipant />,
      },
      // artificial evaluators
      {
        path: 'agents/artificial/evaluators',
        element: (
          <RequireAuth>
            <ArtificialEvaluators />
          </RequireAuth>
        ),
      },

      {
        path: 'agents/artificial/evaluators/new',
        element: <NewArtificialEvaluator />,
      },
      {
        path: 'agents/artificial/evaluators/:agentId',
        element: <ArtificialEvaluator />,
      },
      {
        path: 'agents/artificial/evaluators/:agentId/edit',
        element: <EditArtificialEvaluator />,
      },
      // human assistants
      {
        path: 'agents/human/assistants',
        element: (
          <RequireAuth>
            <HumanAssistants />
          </RequireAuth>
        ),
      },

      {
        path: 'agents/human/assistants/new',
        element: <NewHumanAssistant />,
      },
      {
        path: 'agents/human/assistants/:agentId',
        element: <HumanAssistant />,
      },
      {
        path: 'agents/human/assistants/:agentId/edit',
        element: <EditHumanAssistant />,
      },

      // human participants
      {
        path: 'agents/human/participants',
        element: (
          <RequireAuth>
            <HumanParticipants />
          </RequireAuth>
        ),
      },

      {
        path: 'agents/human/participants/new',
        element: <NewHumanParticipant />,
      },
      {
        path: 'agents/human/participants/:agentId',
        element: <HumanParticipant />,
      },
      {
        path: 'agents/human/participants/:agentId/edit',
        element: <EditHumanParticipant />,
      },
      {
        path: 'simulations',
        element: (
          <RequireAuth>
            <Simulations />
          </RequireAuth>
        ),
      },

      {
        path: 'simulations/new',
        element: <NewSimulation />,
      },
      {
        path: 'simulations/:simulationId',
        element: <Simulation />,
      },
      // setting
      {
        path: 'settings',
        element: <Setting />,
      },
      {
        path: 'settings/edit',
        element: <EditSettings />,
      },
    ],
  },
  {
    path: '/experiments/:experimentId/participants/:participantId/interactions/:interactionId',
    element: <ParticipantInteraction />,
  },
]);

// this is a call to add the app at the root of the document
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <StyledEngineProvider injectFirst>
        <Provider store={store}>
          <RouterProvider router={router} />
        </Provider>
      </StyledEngineProvider>
    </I18nextProvider>
  </React.StrictMode>,
);
