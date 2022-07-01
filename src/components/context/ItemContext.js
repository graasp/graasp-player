import PropTypes from 'prop-types';
import React, { useState } from 'react';

const ItemContext = React.createContext();

const ItemContextProvider = ({ children }) => {
  const [focusedItemId, setFocusedItemId] = useState(null);

  return (
    <ItemContext.Provider
      value={{
        focusedItemId,
        setFocusedItemId,
      }}
    >
      {children}
    </ItemContext.Provider>
  );
};

ItemContextProvider.propTypes = {
  children: PropTypes.node,
};

ItemContextProvider.defaultProps = {
  children: null,
};

export { ItemContext, ItemContextProvider };
