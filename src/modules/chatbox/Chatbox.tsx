import GraaspChatbox from '@graasp/chatbox';
import { ItemRecord, MemberRecord } from '@graasp/sdk/frontend';
import { Loader } from '@graasp/ui';

import { hooks, mutations } from '@/config/queryClient';
import { useCurrentMemberContext } from '@/contexts/CurrentMemberContext';

import { ITEM_CHATBOX_ID } from '../../config/selectors';

const { useItemChat, useAvatarUrl, useItemMemberships } = hooks;
const {
  usePostItemChatMessage,
  usePatchItemChatMessage,
  useDeleteItemChatMessage,
} = mutations;

type Props = {
  item: ItemRecord;
};

const Chatbox = ({ item }: Props): JSX.Element => {
  const { data: messages, isLoading: isChatLoading } = useItemChat(item.id);
  const { data: itemPermissions, isLoading: isLoadingItemPermissions } =
    useItemMemberships(item.id);
  const members = itemPermissions?.map((m) => m.member);
  const { data: currentMember, isLoading: isLoadingCurrentMember } =
    useCurrentMemberContext();
  const { mutate: sendMessage } = usePostItemChatMessage();
  const { mutate: editMessage } = usePatchItemChatMessage();
  const { mutate: deleteMessage } = useDeleteItemChatMessage();

  if (isChatLoading || isLoadingCurrentMember || isLoadingItemPermissions) {
    return <Loader />;
  }

  return (
    <GraaspChatbox
      id={ITEM_CHATBOX_ID}
      members={members}
      currentMember={currentMember as MemberRecord}
      chatId={item.id}
      messages={messages}
      sendMessageFunction={sendMessage}
      editMessageFunction={editMessage}
      deleteMessageFunction={deleteMessage}
      useAvatarUrl={useAvatarUrl}
    />
  );
};

export default Chatbox;
