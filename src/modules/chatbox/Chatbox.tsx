import GraaspChatbox from '@graasp/chatbox';
import { ItemRecord, MemberRecord } from '@graasp/sdk/frontend';
import { Loader } from '@graasp/ui';

import { hooks, mutations } from '@/config/queryClient';
import { useCurrentMemberContext } from '@/contexts/CurrentMemberContext';

import { ITEM_CHATBOX_ID } from '../../config/selectors';

const { useItemChat, useMembers, useAvatar, useItemMemberships } = hooks;
const {
  usePostItemChatMessage,
  usePatchItemChatMessage,
  useDeleteItemChatMessage,
} = mutations;

type Props = {
  item: ItemRecord;
};

const Chatbox = ({ item }: Props): JSX.Element => {
  const { data: chat, isLoading: isChatLoading } = useItemChat(item.id);
  const { data: itemPermissions, isLoading: isLoadingItemPermissions } =
    useItemMemberships(item.id);
  const { data: members, isLoading: isMembersLoading } = useMembers(
    itemPermissions?.map((m) => m.memberId)?.toArray() || [],
  );
  const { data: currentMember, isLoading: isLoadingCurrentMember } =
    useCurrentMemberContext();
  const { mutate: sendMessage } = usePostItemChatMessage();
  const { mutate: editMessage } = usePatchItemChatMessage();
  const { mutate: deleteMessage } = useDeleteItemChatMessage();

  if (
    isChatLoading ||
    isLoadingCurrentMember ||
    isMembersLoading ||
    isLoadingItemPermissions
  ) {
    return <Loader />;
  }

  return (
    <GraaspChatbox
      id={ITEM_CHATBOX_ID}
      members={members}
      currentMember={currentMember as MemberRecord}
      chatId={item.id}
      messages={chat?.messages}
      sendMessageFunction={sendMessage}
      editMessageFunction={editMessage}
      deleteMessageFunction={deleteMessage}
      useAvatarHook={useAvatar}
    />
  );
};

export default Chatbox;
