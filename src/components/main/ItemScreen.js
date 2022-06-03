import React from 'react';
import { useParams } from 'react-router-dom';
import { MUTATION_KEYS } from '@graasp/query-client';
import PropTypes from 'prop-types';
import { ItemLoginAuthorization } from '@graasp/ui';
import { ItemContextProvider } from '../context/ItemContext';
import { useMutation, hooks } from '../../config/queryClient';
import CookiesBanner from './CookiesBanner';
import MainScreen from './MainScreen';
import ItemForbiddenScreen from './ItemForbiddenScreen';

const { useItem, useItemLogin, useCurrentMember } = hooks;

const ItemScreen = () => (
  <ItemContextProvider>
    <CookiesBanner />
    <MainScreen />
  </ItemContextProvider>
);

ItemScreen.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({ itemId: PropTypes.string }).isRequired,
  }).isRequired,
};

const WrappedItemScreen = () => {
  const { mutate: signOut } = useMutation(MUTATION_KEYS.SIGN_OUT);
  const { mutate: itemLoginSignIn } = useMutation(
    MUTATION_KEYS.POST_ITEM_LOGIN,
  );
  const { rootId } = useParams();

  const ForbiddenContent = <ItemForbiddenScreen />;

  const Component = ItemLoginAuthorization({
    signIn: itemLoginSignIn,
    signOut,
    itemId: rootId,
    useCurrentMember,
    useItem,
    useItemLogin,
    ForbiddenContent,
  })(ItemScreen);
  return <Component />;
};

export default WrappedItemScreen;
