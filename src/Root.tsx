import { I18nextProvider } from 'react-i18next';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { CssBaseline, GlobalStyles } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';

import { theme } from '@graasp/ui';

import { SHOW_NOTIFICATIONS } from '@/config/env';
import i18n from '@/config/i18n';
import {
  QueryClientProvider,
  ReactQueryDevtools,
  queryClient,
} from '@/config/queryClient';
import { CurrentMemberContextProvider } from '@/contexts/CurrentMemberContext';

import App from './App';

const globalStyles = <GlobalStyles styles={{ p: { fontSize: '1rem' } }} />;

const Root = (): JSX.Element => (
  <QueryClientProvider client={queryClient}>
    <I18nextProvider i18n={i18n}>
      {SHOW_NOTIFICATIONS && (
        <ToastContainer position="bottom-right" theme="colored" />
      )}
      {globalStyles}
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <CurrentMemberContextProvider>
            <App />
          </CurrentMemberContextProvider>
        </Router>
      </ThemeProvider>
    </I18nextProvider>
    {import.meta.env.DEV && <ReactQueryDevtools />}
  </QueryClientProvider>
);

export default Root;
