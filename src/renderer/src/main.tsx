import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { StyledEngineProvider } from '@mui/joy/styles';

import App from './App.tsx';
import Agent from './components/Agents/Agent';
import Agents from './components/Agents/Agents';
import NewAgent from './components/Agents/NewAgent';
import Conversation from './components/Conversations/Conversation.tsx';
import Conversations from './components/Conversations/Conversations.tsx';
import NewConversation from './components/Conversations/NewConversation';
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
        path: 'Agents',
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
