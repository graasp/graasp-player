import 'katex/dist/katex.min.css';
import 'react-quill/dist/quill.snow.css';
import 'react-toastify/dist/ReactToastify.css';

import { I18nextProvider } from 'react-i18next';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { CssBaseline, GlobalStyles } from '@mui/material';

import { AccountType } from '@graasp/sdk';
import { DEFAULT_LANG, langs } from '@graasp/translations';
import { ThemeProvider } from '@graasp/ui';

import { ErrorBoundary } from '@sentry/react';

import { SHOW_NOTIFICATIONS } from '@/config/env';
import {
  QueryClientProvider,
  ReactQueryDevtools,
  hooks,
  queryClient,
} from '@/config/queryClient';
import { CurrentMemberContextProvider } from '@/contexts/CurrentMemberContext';

import App from './App';
import i18nConfig from './config/i18n';
import FallbackComponent from './modules/errors/FallbackComponent';

const globalStyles = (
  <GlobalStyles
    styles={{
      p: { fontSize: '1rem' },
      // required for fullscreen
      '::backdrop': { backgroundColor: 'white' },
    }}
  />
);

const ThemeWrapper = () => {
  const { data: currentAccount } = hooks.useCurrentMember();
  return (
    <ThemeProvider
      langs={langs}
      languageSelectSx={{ mb: 2, mr: 2 }}
      i18n={i18nConfig}
      defaultDirection={i18nConfig.dir(
        currentAccount?.type === AccountType.Individual
          ? (currentAccount.extra.lang ?? DEFAULT_LANG)
          : DEFAULT_LANG,
      )}
    >
      <CssBaseline />
      <Router>
        <ErrorBoundary fallback={<FallbackComponent />}>
          <CurrentMemberContextProvider>
            <App />
          </CurrentMemberContextProvider>
        </ErrorBoundary>
      </Router>
    </ThemeProvider>
  );
};

const Root = (): JSX.Element => (
  <QueryClientProvider client={queryClient}>
    <I18nextProvider i18n={i18nConfig}>
      {SHOW_NOTIFICATIONS && (
        <ToastContainer stacked position="bottom-right" theme="colored" />
      )}
      {globalStyles}
      <ThemeWrapper />
    </I18nextProvider>
    {import.meta.env.DEV && import.meta.env.MODE !== 'test' && (
      <ReactQueryDevtools />
    )}
  </QueryClientProvider>
);

export default Root;
