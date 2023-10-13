import React from 'react'
import ReactDOM from 'react-dom/client'
import { StyledEngineProvider } from '@mui/joy/styles'
import App from './App.tsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Conversations from './components/Conversations/Conversations.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: 'conversations',
        element: <Conversations />
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <StyledEngineProvider injectFirst>
      <RouterProvider router={router} />
    </StyledEngineProvider>
  </React.StrictMode>
)
