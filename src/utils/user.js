// eslint-disable-next-line import/prefer-default-export
export const isRegularUser = (user) => {
  if (!user) {
    return false;
  }

  // todo: to change
  return Boolean(!user?.email?.includes('@graasp.org'));
};
