import { Member, ThumbnailSize } from '@graasp/sdk';
import { COMMON } from '@graasp/translations';
import { Avatar } from '@graasp/ui';

import { AVATAR_ICON_HEIGHT } from '@/config/constants';
import { useCommonTranslation } from '@/config/i18n';
import { hooks } from '@/config/queryClient';
import { buildMemberAvatarClass } from '@/config/selectors';

type Props = {
  member?: Member | null;
};

const MemberAvatar = ({ member }: Props): JSX.Element => {
  const { t } = useCommonTranslation();
  const {
    data: avatarUrl,
    isLoading: isLoadingAvatar,
    isFetching: isFetchingAvatar,
  } = hooks.useAvatarUrl({
    id: member?.id,
    size: ThumbnailSize.Small,
  });

  return (
    <Avatar
      isLoading={isLoadingAvatar || isFetchingAvatar}
      className={buildMemberAvatarClass(member?.id)}
      alt={member?.name || t(COMMON.AVATAR_DEFAULT_ALT)}
      component="avatar"
      variant="circular"
      maxWidth={AVATAR_ICON_HEIGHT}
      maxHeight={AVATAR_ICON_HEIGHT}
      url={avatarUrl}
      sx={{ mx: 1 }}
    />
  );
};

export default MemberAvatar;
