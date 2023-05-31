import { toast } from 'react-toastify';

import { Notifier } from '@graasp/query-client';

// import { FAILURE_MESSAGES, SUCCESS_MESSAGES } from '@graasp/translations';

const notifier: Notifier = ({ type, payload }) => {
  const message = null;
  switch (type) {
    // error messages

    // progress messages
    default:
  }

  // error notification
  if (payload?.error && message) {
    // todo: can't use translation hooks inside this function
    // const translatedMessage =
    //   t(message) || t(FAILURE_MESSAGES.UNEXPECTED_ERROR);
    toast.error(message);
  }
  // success notification
  else if (message) {
    // const translatedMessage = t(message) || t(SUCCESS_MESSAGES.DEFAULT_SUCCESS);
    toast.success(message);
  }
};
export default notifier;
