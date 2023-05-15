/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { initReactI18next, useTranslation } from 'react-i18next';

import { namespaces } from '@graasp/translations';
import buildI18n from '@graasp/translations/dist/i18n';

const i18n = buildI18n(namespaces.player).use(initReactI18next);

export const useCommonTranslation = () => useTranslation(namespaces.common);
export const usePlayerTranslation = () => useTranslation(namespaces.player);
export const useMessagesTranslation = () => useTranslation(namespaces.messages);
export const useAuthTranslation = () => useTranslation(namespaces.auth);
export const useBuilderTranslation = () => useTranslation(namespaces.builder);
export default i18n;
