// import { resources } from '@graasp/translations';
import 'i18next';

declare module 'i18next' {
  interface CustomTypeOptions {
    //     // defaultNS: typeof namespaces.player;
    //     resources: (typeof resources)['en'];
    returnNull: false;
  }
}
