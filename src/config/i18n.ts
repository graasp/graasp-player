/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { initReactI18next, useTranslation } from 'react-i18next';

import { namespaces } from '@graasp/translations';
import buildI18n from '@graasp/translations/dist/i18n';

import ar from '../langs/ar.json';
import de from '../langs/de.json';
import en from '../langs/en.json';
import fr from '../langs/fr.json';
import it from '../langs/it.json';

const i18n = buildI18n().use(initReactI18next);
const PLAYER_NAMESPACE = 'player';
i18n.addResourceBundle('en', PLAYER_NAMESPACE, en);
i18n.addResourceBundle('fr', PLAYER_NAMESPACE, fr);
i18n.addResourceBundle('de', PLAYER_NAMESPACE, de);
i18n.addResourceBundle('it', PLAYER_NAMESPACE, it);
i18n.addResourceBundle('ar', PLAYER_NAMESPACE, ar);

export const usePlayerTranslation = () => useTranslation(PLAYER_NAMESPACE);
export const useCommonTranslation = () => useTranslation(namespaces.common);
export const useMessagesTranslation = () => useTranslation(namespaces.messages);
export const useAuthTranslation = () => useTranslation(namespaces.auth);
export default i18n;
