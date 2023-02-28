import { toast } from 'react-toastify';

import { FAILURE_MESSAGES, SUCCESS_MESSAGES } from '@graasp/translations';

import i18n, { useMessagesTranslation } from '@/config/i18n';

type NotifierType = {
  type: string;
  payload: { error: string };
};

// todo: check how this works and improve error reporting
export default ({ type, payload }: NotifierType): void => {
  const { t } = useMessagesTranslation();
  const message = null;
  switch (type) {
    // error messages

    // progress messages
    default:
  }

  // error notification
  if (payload?.error && message) {
    toast.error(t(FAILURE_MESSAGES.UNEXPECTED_ERROR), i18n.t(message));
  }
  // success notification
  else if (message) {
    toast.success(t(SUCCESS_MESSAGES.DEFAULT_SUCCESS), i18n.t(message));
  }
};
