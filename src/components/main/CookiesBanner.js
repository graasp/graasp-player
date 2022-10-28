import React from 'react';
import { useTranslation } from 'react-i18next';

import { CookiesBanner } from '@graasp/ui';

import { ACCEPT_COOKIES_NAME, DOMAIN } from '../../config/constants';

const Component = () => {
  const { t } = useTranslation();

  return (
    <CookiesBanner
      acceptText={t('Accept all')}
      declineButtonText={t('Reject non-essential')}
      cookieName={ACCEPT_COOKIES_NAME}
      domain={DOMAIN}
      text={t(
        `We use cookies and other tracking technologies to improve your browsing experience on our website, to analyze our website traffic, and to understand where our visitors are coming from. By browsing our website, you consent to our use of cookies and other tracking technologies.`,
      )}
    />
  );
};

export default Component;
