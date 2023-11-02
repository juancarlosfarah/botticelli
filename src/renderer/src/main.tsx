import React from 'react';
import ReactDOM from 'react-dom/client';
import { StyledEngineProvider } from '@mui/joy/styles';
import App from './App.tsx';
import { Provider } from 'react-redux';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Conversations from './components/Conversations/Conversations.tsx';
import Conversation from './components/Conversations/Conversation.tsx';
import NewConversation from './components/Conversations/NewConversation';
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
