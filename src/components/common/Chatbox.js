import { Record } from 'immutable';
import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import GraaspChatbox from '@graasp/chatbox';
import { MUTATION_KEYS } from '@graasp/query-client';
import { Loader } from '@graasp/ui';

import { hooks, useMutation } from '../../config/queryClient';
import { ITEM_CHATBOX_ID } from '../../config/selectors';
import { CurrentMemberContext } from '../context/CurrentMemberContext';

const { useItemChat, useMembers, useAvatar, useItemMemberships } = hooks;

const Chatbox = ({ item }) => {
  const { t } = useTranslation();
  const { data: chat, isLoading: isChatLoading } = useItemChat(item.id);
  const { data: itemPermissions, isLoading: isLoadingItemPermissions } =
    useItemMemberships(item.id);
  const { data: members, isLoading: isMembersLoading } = useMembers(
    itemPermissions?.map((m) => m.memberId)?.toArray() || [],
  );
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

  if (
    isChatLoading ||
    isLoadingCurrentMember ||
    isMembersLoading ||
    isLoadingItemPermissions
  ) {
    return <Loader />;
  }

  const messages = chat?.messages ?? [];

  return (
    <GraaspChatbox
      id={ITEM_CHATBOX_ID}
      members={members}
      currentMember={currentMember}
      chatId={item.id}
      messages={chat?.messages}
      sendMessageFunction={sendMessage}
      editMessageFunction={editMessage}
      deleteMessageFunction={deleteMessage}
      useAvatarHook={useAvatar}
    />
  );
};

Chatbox.propTypes = {
  item: PropTypes.instanceOf(Record).isRequired,
};

export default Chatbox;
