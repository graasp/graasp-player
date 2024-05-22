import React from 'react';
import ReactDOM from 'react-dom/client';
import ReactGA from 'react-ga4';

import {
  BUILDER_ITEMS_PREFIX,
  ClientHostManager,
  Context,
  PLAYER_ITEMS_PREFIX,
  hasAcceptedCookies,
} from '@graasp/sdk';

import * as Sentry from '@sentry/react';

import {
  APP_VERSION,
  GA_MEASUREMENT_ID,
  GRAASP_BUILDER_HOST,
  SENTRY_DSN,
} from '@/config/env';
import { SENTRY_ENVIRONMENT, SENTRY_TRACE_SAMPLE_RATE } from '@/config/sentry';

import pkg from '../package.json';
import Root from './Root';

// Add the hosts of the different clients
ClientHostManager.getInstance()
  .addPrefix(Context.Builder, BUILDER_ITEMS_PREFIX)
  .addPrefix(Context.Player, PLAYER_ITEMS_PREFIX)
  .addHost(Context.Builder, new URL(GRAASP_BUILDER_HOST))
  .addHost(Context.Player, new URL(window.location.origin));

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
