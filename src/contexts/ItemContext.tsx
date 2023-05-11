import React, { useContext, useMemo, useState } from 'react';

import { ItemRecord } from '@graasp/sdk/frontend';

import { List } from 'immutable';

import { hooks } from '@/config/queryClient';

type Props = {
  rootId: string;
  children: JSX.Element | JSX.Element[];
};

type ItemContextType = {
  rootId: string;
  focusedItemId?: string;
  setFocusedItemId: (id: string) => void;
  rootItem?: ItemRecord;
  isRootItemLoading: boolean;
  isRootItemError: boolean;
  descendants?: List<ItemRecord>;
  isDescendantsLoading: boolean;
  isDescendantsError: boolean;
};

const ItemContext = React.createContext<ItemContextType>({
  rootId: '',
  focusedItemId: '',
  setFocusedItemId: () => null,
  isRootItemLoading: true,
  isRootItemError: false,
  isDescendantsLoading: true,
  isDescendantsError: false,
});

const ItemContextProvider = ({ children, rootId }: Props): JSX.Element => {
  const [focusedItemId, setFocusedItemId] = useState<string>();
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

export const useItemContext = (): ItemContextType => useContext(ItemContext);

export { ItemContext, ItemContextProvider };
