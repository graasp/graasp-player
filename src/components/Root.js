import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { ToastContainer } from 'react-toastify';
import { grey } from '@material-ui/core/colors';
import { createTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { GlobalStyles } from '@mui/material';
import App from './App';
import i18nConfig from '../config/i18n';
import { NODE_ENV, ENV, SHOW_NOTIFICATIONS } from '../config/constants';
import {
  queryClient,
  QueryClientProvider,
  ReactQueryDevtools,
} from '../config/queryClient';
import { CurrentMemberContextProvider } from './context/CurrentMemberContext';

const theme = createTheme({
  palette: {
    primary: {
      main: '#5050d2',
      selected: '#cbcbef',
    },
    secondary: { main: '#ffffff' },
  },
  zIndex: {
    drawer: 1000,
  },
  overrides: {
    MuiAvatar: {
      colorDefault: {
        backgroundColor: grey[400],
      },
    },
  },
});

const globalStyles = <GlobalStyles styles={{ p: { fontSize: '1rem' } }} />;

const Root = () => (
  <QueryClientProvider client={queryClient}>
    <I18nextProvider i18n={i18nConfig}>
      {SHOW_NOTIFICATIONS && (
        <ToastContainer position="bottom-right" theme="colored" />
      )}
      {globalStyles}
      <MuiThemeProvider theme={theme}>
        <Router>
          <CurrentMemberContextProvider>
            <App />
          </CurrentMemberContextProvider>
        </Router>
      </MuiThemeProvider>
    </I18nextProvider>
    {NODE_ENV === ENV.DEVELOPMENT && <ReactQueryDevtools initialIsOpen />}
  </QueryClientProvider>
);

export default Root;
