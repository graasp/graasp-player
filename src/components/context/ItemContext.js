import PropTypes from 'prop-types';
import React, { useMemo, useState } from 'react';

const ItemContext = React.createContext();

const ItemContextProvider = ({ children }) => {
  const [focusedItemId, setFocusedItemId] = useState(null);

  const value = useMemo(
    () => ({
      focusedItemId,
      setFocusedItemId,
    }),
    [focusedItemId, setFocusedItemId],
  );

  return <ItemContext.Provider value={value}>{children}</ItemContext.Provider>;
};

ItemContextProvider.propTypes = {
  children: PropTypes.node,
};

ItemContextProvider.defaultProps = {
  children: null,
};

export { ItemContext, ItemContextProvider };
