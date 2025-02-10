import { ReactElement, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

import Box from '@mui/joy/Box';
import CssBaseline from '@mui/joy/CssBaseline';
import { CssVarsProvider, extendTheme } from '@mui/joy/styles';

import i18next from 'i18next';

import Header from './components/Header';
import Sidebar from './components/Sidebar';

const theme = extendTheme();

export default function JoyOrderDashboardTemplate(): ReactElement {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    window.languageChange.language((value) => {
      setLanguage(value);
    });

    i18next.changeLanguage(language);
  }, [language]);

  return (
    <CssVarsProvider theme={theme} disableTransitionOnChange>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100dvh' }}>
        <Header />
        <Sidebar />
        <Box
          component="main"
          className="MainContent"
          sx={{
            px: {
              xs: 2,
              md: 6,
            },
            pt: {
              xs: 'calc(12px + var(--Header-height))',
              sm: 'calc(12px + var(--Header-height))',
              md: 3,
            },
            pb: {
              xs: 2,
              sm: 2,
              md: 3,
            },
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
            height: '100dvh',
            gap: 1,
            overflowY: 'scroll',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </CssVarsProvider>
  );
}
