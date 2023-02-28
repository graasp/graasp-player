import { MemberRecord } from '@graasp/sdk/frontend';

// eslint-disable-next-line import/prefer-default-export
export const isRegularUser = (user?: MemberRecord): boolean => {
  if (!user) {
    return false;
  }

  // todo: to change
  return Boolean(!user?.email?.includes('@graasp.org'));
};
