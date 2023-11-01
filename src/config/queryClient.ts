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
  // todo: improve types
  notifier,
  enableWebsocket: true,
  defaultQueryOptions: {
    keepPreviousData: true,
    // avoid refetching when same data are closely fetched
    staleTime: 1000, // ms
    cacheTime: 1000, // ms
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
