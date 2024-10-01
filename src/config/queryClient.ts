import { configureQueryClient } from '@graasp/query-client';

import { API_HOST, DOMAIN } from '@/config/env';

import notifier from './notifier';

const {
  queryClient,
  QueryClientProvider,
  hooks,
  useMutation,
  mutations,
  ReactQueryDevtools,
  axios,
} = configureQueryClient({
  API_HOST,
  DOMAIN,
  notifier,
  enableWebsocket: true,
  defaultQueryOptions: {
    keepPreviousData: true,
  },
});
export {
  queryClient,
  QueryClientProvider,
  hooks,
  useMutation,
  mutations,
  ReactQueryDevtools,
  axios,
};
