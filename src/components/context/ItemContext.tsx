import React, { useMemo, useState } from 'react';

import { hooks } from '../../config/queryClient';

type Props = {
  rootId: string;
  children: JSX.Element | JSX.Element[];
};

const ItemContext = React.createContext({});

const ItemContextProvider = ({ children, rootId }: Props): JSX.Element => {
  const [focusedItemId, setFocusedItemId] = useState(null);
  const {
    data: rootItem,
    isLoading: isRootItemLoading,
    isError: isRootItemError,
  } = hooks.useItem(rootId);
  const {
    data: descendants,
    isLoading: isDescendantsLoading,
    isError: isDescendantsError,
  } = hooks.useDescendants({ id: rootId, enabled: true });

  const value = useMemo(
    () => ({
      rootId,
      focusedItemId,
      setFocusedItemId,
      rootItem,
      isRootItemLoading,
      isRootItemError,
      descendants,
      isDescendantsLoading,
      isDescendantsError,
    }),
    [
      rootId,
      focusedItemId,
      setFocusedItemId,
      rootItem,
      isRootItemLoading,
      isRootItemError,
      descendants,
      isDescendantsLoading,
      isDescendantsError,
    ],
  );

  return <ItemContext.Provider value={value}>{children}</ItemContext.Provider>;
};

export { ItemContext, ItemContextProvider };
