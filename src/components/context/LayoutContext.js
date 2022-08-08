import PropTypes from 'prop-types';
import React, { useState } from 'react';

const LayoutContext = React.createContext();

const LayoutContextProvider = ({ children }) => {
  const [isPinnedMenuOpen, setIsPinnedMenuOpen] = useState(true);
  const [isChatboxMenuOpen, setIsChatboxMenuOpen] = useState(false);

  return (
    <LayoutContext.Provider
      value={{
        isPinnedMenuOpen,
        setIsPinnedMenuOpen,
        isChatboxMenuOpen,
        setIsChatboxMenuOpen,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};

LayoutContextProvider.propTypes = {
  children: PropTypes.node,
};

LayoutContextProvider.defaultProps = {
  children: null,
};

export { LayoutContext, LayoutContextProvider };
