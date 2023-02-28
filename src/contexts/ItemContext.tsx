import { createContext, useContext, useMemo, useState } from 'react';

type ItemContextType = {
  focusedItemId?: string;
  setFocusedItemId: (itemId: string) => void;
};

const ItemContext = createContext<ItemContextType>({
  focusedItemId: undefined,
  setFocusedItemId: () => null,
});

type Props = {
  children: JSX.Element | JSX.Element[];
};

export const ItemContextProvider = ({ children }: Props): JSX.Element => {
  const [focusedItemId, setFocusedItemId] = useState<string>();

  const value = useMemo(
    () => ({
      focusedItemId,
      setFocusedItemId,
    }),
    [focusedItemId, setFocusedItemId],
  );

  return <ItemContext.Provider value={value}>{children}</ItemContext.Provider>;
};

export const useItemContext = (): ItemContextType => useContext(ItemContext);
