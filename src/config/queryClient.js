import { configureQueryClient } from '@graasp/query-client';

import notifier from '../middlewares/notifier';
import { API_HOST, DOMAIN } from './constants';

const {
  queryClient,
  QueryClientProvider,
  hooks,
  useMutation,
  ReactQueryDevtools,
} = configureQueryClient({
  API_HOST,
  DOMAIN,
  notifier,
  enableWebsocket: true,
  defaultQueryOptions: {
    keepPreviousData: true,
    // avoid refetching when same data are closely fetched
    staleTime: 1000, // ms
  },
});
export {
  queryClient,
  QueryClientProvider,
  hooks,
  useMutation,
  ReactQueryDevtools,
};
