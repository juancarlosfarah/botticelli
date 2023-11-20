import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { StyledEngineProvider } from '@mui/joy/styles';

import App from './App.tsx';
import Conversation from './components/Conversations/Conversation.tsx';
import Conversations from './components/Conversations/Conversations.tsx';
import NewConversation from './components/Conversations/NewConversation';
import Agent from './components/agent/Agent';
import Agents from './components/agent/Agents';
import NewAgent from './components/agent/NewAgent';
import ArtificialAssistant from './components/agent/artificial/assistant/ArtificialAssistant';
import ArtificialAssistants from './components/agent/artificial/assistant/ArtificialAssistants';
import NewArtificialAssistant from './components/agent/artificial/assistant/NewArtificialAssistant';
import ArtificialParticipant from './components/agent/artificial/participant/ArtificialParticipant';
import ArtificialParticipants from './components/agent/artificial/participant/ArtificialParticipants';
import NewArtificialParticipant from './components/agent/artificial/participant/NewArtificialParticipant';
import HumanAssistant from './components/agent/human/assistant/HumanAssistant';
import HumanAssistants from './components/agent/human/assistant/HumanAssistants';
import NewHumanAssistant from './components/agent/human/assistant/NewHumanAssistant';
import HumanParticipant from './components/agent/human/participant/HumanParticipant';
import HumanParticipants from './components/agent/human/participant/HumanParticipants';
import NewHumanParticipant from './components/agent/human/participant/NewHumanParticipant';
import './index.css';
import store from './store';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: 'conversations',
        element: <Conversations />,
      },
      {
        path: 'conversations/new',
        element: <NewConversation />,
      },
      {
        path: 'conversations/:conversationId',
        element: <Conversation />,
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
      // artificial participants
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
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <StyledEngineProvider injectFirst>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </StyledEngineProvider>
  </React.StrictMode>,
);
