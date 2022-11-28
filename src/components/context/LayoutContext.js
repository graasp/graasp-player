import PropTypes from 'prop-types';
import React, { useMemo, useState } from 'react';

const LayoutContext = React.createContext();

const LayoutContextProvider = ({ children }) => {
  const [isPinnedMenuOpen, setIsPinnedMenuOpen] = useState(true);
  const [isChatboxMenuOpen, setIsChatboxMenuOpen] = useState(false);

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

LayoutContextProvider.propTypes = {
  children: PropTypes.node,
};

LayoutContextProvider.defaultProps = {
  children: null,
};

export { LayoutContext, LayoutContextProvider };
