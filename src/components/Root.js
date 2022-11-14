import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { GlobalStyles } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';

import { theme } from '@graasp/ui';

import { ENV, NODE_ENV, SHOW_NOTIFICATIONS } from '../config/constants';
import i18nConfig from '../config/i18n';
import {
  QueryClientProvider,
  ReactQueryDevtools,
  queryClient,
} from '../config/queryClient';
import App from './App';
import { CurrentMemberContextProvider } from './context/CurrentMemberContext';

const globalStyles = <GlobalStyles styles={{ p: { fontSize: '1rem' } }} />;

const Root = () => (
  <QueryClientProvider client={queryClient}>
    <I18nextProvider i18n={i18nConfig}>
      {SHOW_NOTIFICATIONS && (
        <ToastContainer position="bottom-right" theme="colored" />
      )}
      {globalStyles}
      <ThemeProvider theme={theme}>
        <Router>
          <CurrentMemberContextProvider>
            <App />
          </CurrentMemberContextProvider>
        </Router>
      </ThemeProvider>
    </I18nextProvider>
    {NODE_ENV === ENV.DEVELOPMENT && <ReactQueryDevtools />}
  </QueryClientProvider>
);

export default Root;
