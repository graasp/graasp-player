import { createContext, useContext, useMemo, useState } from 'react';

type LayoutContextType = {
  isPinnedMenuOpen: boolean;
  setIsPinnedMenuOpen: (state: boolean) => void;
  isChatboxMenuOpen: boolean;
  setIsChatboxMenuOpen: (state: boolean) => void;
};

const LayoutContext = createContext<LayoutContextType>({
  isPinnedMenuOpen: true,
  setIsPinnedMenuOpen: () => null,
  isChatboxMenuOpen: false,
  setIsChatboxMenuOpen: () => null,
});

type Props = {
  children: JSX.Element;
};

export const LayoutContextProvider = ({ children }: Props): JSX.Element => {
  const [isPinnedMenuOpen, setIsPinnedMenuOpen] = useState<boolean>(true);
  const [isChatboxMenuOpen, setIsChatboxMenuOpen] = useState<boolean>(false);

  const value = useMemo(
    () => ({
      isPinnedMenuOpen,
      setIsPinnedMenuOpen,
      isChatboxMenuOpen,
      setIsChatboxMenuOpen,
    }),
    [
      isPinnedMenuOpen,
      setIsPinnedMenuOpen,
      isChatboxMenuOpen,
      setIsChatboxMenuOpen,
    ],
  );

  return (
    <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>
  );
};

export const useLayoutContext = (): LayoutContextType =>
  useContext(LayoutContext);
