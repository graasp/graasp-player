import React from 'react';
import ReactDOM from 'react-dom/client';
import ReactGA from 'react-ga4';

import { hasAcceptedCookies } from '@graasp/sdk';
import '@graasp/ui/dist/bundle.css';

import * as Sentry from '@sentry/react';

import { APP_VERSION, GA_MEASUREMENT_ID, SENTRY_DSN } from '@/config/env';
import { SENTRY_ENVIRONMENT, SENTRY_TRACE_SAMPLE_RATE } from '@/config/sentry';

import pkg from '../package.json';
import Root from './Root';

Sentry.init({
  dsn: SENTRY_DSN,
  integrations: [new Sentry.BrowserTracing()],
  environment: SENTRY_ENVIRONMENT,
  release: `${pkg.name}@${APP_VERSION}`,

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: SENTRY_TRACE_SAMPLE_RATE,
});

if (GA_MEASUREMENT_ID && hasAcceptedCookies()) {
  ReactGA.initialize(GA_MEASUREMENT_ID);
  ReactGA.send('pageview');
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
);
