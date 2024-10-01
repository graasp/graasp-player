import { toast } from 'react-toastify';

import { Notifier, routines } from '@graasp/query-client';
import { FAILURE_MESSAGES } from '@graasp/translations';

import axios from 'axios';

import i18n from './i18n';

const { requestMembershipRoutine } = routines;

export const getErrorMessageFromPayload = (
  payload?: Parameters<Notifier>[0]['payload'],
): string => {
  if (payload?.error && axios.isAxiosError(payload.error)) {
    return (
      payload.error.response?.data.message ?? FAILURE_MESSAGES.UNEXPECTED_ERROR
    );
  }

  return payload?.error?.message ?? FAILURE_MESSAGES.UNEXPECTED_ERROR;
};

const notifier: Notifier = ({ type, payload }) => {
  let message = null;
  switch (type) {
    // error messages
    case requestMembershipRoutine.FAILURE: {
      message = getErrorMessageFromPayload(payload);
      break;
    }
    // progress messages
    default:
  }

  // error notification
  if (payload?.error && message) {
    toast.error(i18n.t(message) || i18n.t(FAILURE_MESSAGES.UNEXPECTED_ERROR));
  }
  // success notification
  else if (message) {
    toast.success(i18n.t(message));
  }
};
export default notifier;
