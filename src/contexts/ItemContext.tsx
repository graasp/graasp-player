import React, { useContext, useMemo, useState } from 'react';

import { DiscriminatedItem } from '@graasp/sdk';

import { hooks } from '@/config/queryClient';

type Props = {
  rootId: string;
  children: JSX.Element | JSX.Element[];
};

type ItemContextType = {
  rootId: string;
  focusedItemId?: string;
  setFocusedItemId: (id: string) => void;
  rootItem?: DiscriminatedItem;
  isRootItemLoading: boolean;
  isRootItemError: boolean;
  descendants?: DiscriminatedItem[];
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
