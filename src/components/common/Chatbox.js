import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import GraaspChatbox from '@graasp/chatbox';
import { MUTATION_KEYS } from '@graasp/query-client';
import { Map, List } from 'immutable';
import { Loader } from '@graasp/ui';
import { ITEM_CHATBOX_ID } from '../../config/selectors';
import { hooks, useMutation } from '../../config/queryClient';
import { HEADER_HEIGHT } from '../../config/constants';
import { CurrentMemberContext } from '../context/CurrentMemberContext';

const { useItemChat, useMembers } = hooks;

const Chatbox = ({ item }) => {
  const { t } = useTranslation();
  const { data: chat, isLoading: isChatLoading } = useItemChat(item.get('id'));
  const { data: members, isLoading: isMembersLoading } = useMembers([
    ...new Set(chat?.get('messages').map(({ creator }) => creator)),
  ]);
  const { data: currentMember, isLoadingCurrentMember } =
    useContext(CurrentMemberContext);
  const { mutate: sendMessage } = useMutation(
    MUTATION_KEYS.POST_ITEM_CHAT_MESSAGE,
  );
  const { mutate: editMessage } = useMutation(
    MUTATION_KEYS.PATCH_ITEM_CHAT_MESSAGE,
  );
  const { mutate: deleteMessage } = useMutation(
    MUTATION_KEYS.DELETE_ITEM_CHAT_MESSAGE,
  );
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  useEffect(
    () => {
      const handleResize = () => {
        setWindowHeight(window.innerHeight);
      };
      window.addEventListener('resize', handleResize);

      // cleanup eventListener
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    },
    // run on first render only
    [],
  );

  const renderChatbox = () => {
    if (isChatLoading || isLoadingCurrentMember || isMembersLoading) {
      return <Loader />;
    }

    const messages = chat?.get('messages') ?? [];

    return (
      <GraaspChatbox
        id={ITEM_CHATBOX_ID}
        members={members}
        currentMember={currentMember}
        chatId={item.get('id')}
        messages={List(messages)}
        height={windowHeight - HEADER_HEIGHT * 2}
        sendMessageFunction={sendMessage}
        editMessageFunction={editMessage}
        deleteMessageFunction={deleteMessage}
      />
    );
  };

  return (
    <>
      <Typography variant="h5">{t('Comments')}</Typography>
      {renderChatbox()}
    </>
  );
};

Chatbox.propTypes = {
  item: PropTypes.instanceOf(Map).isRequired,
};

export default Chatbox;
