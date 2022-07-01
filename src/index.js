import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactGA from 'react-ga4';

import '@graasp/ui/dist/bundle.css';

import Root from './components/Root';
import { GA_MEASUREMENT_ID, SENTRY_DSN } from './config/constants';
import { SENTRY_ENVIRONMENT, SENTRY_TRACE_SAMPLE_RATE } from './config/sentry';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { hasAcceptedCookies } from './utils/cookies';

Sentry.init({
  dsn: SENTRY_DSN,
  integrations: [new BrowserTracing()],
  environment: SENTRY_ENVIRONMENT,

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: SENTRY_TRACE_SAMPLE_RATE,
});

if (GA_MEASUREMENT_ID && hasAcceptedCookies()) {
  ReactGA.initialize(GA_MEASUREMENT_ID);
  ReactGA.send('pageview');
}

ReactDOM.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
