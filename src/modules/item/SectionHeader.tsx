import { Stack, Typography } from '@mui/material';

import { PackedItem, formatDate } from '@graasp/sdk';
import { TextDisplay, Thumbnail } from '@graasp/ui';

import { usePlayerTranslation } from '@/config/i18n';
import { FOLDER_NAME_TITLE_CLASS } from '@/config/selectors';
import { PLAYER } from '@/langs/constants';

type SectionHeaderProps = {
  item: PackedItem;
};

const SectionHeader = ({ item }: SectionHeaderProps): JSX.Element => {
  const { t, i18n } = usePlayerTranslation();
  const thumbnailSrc = item.thumbnails?.medium;

  return (
    <Stack direction="column" spacing={2}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Thumbnail
          maxWidth="96px"
          maxHeight="96px"
          url={thumbnailSrc}
          alt={item.name}
          sx={{ borderRadius: 5 }}
        />
        <Stack>
          <Typography className={FOLDER_NAME_TITLE_CLASS} variant="h2">
            {item.name}
          </Typography>
          <Typography variant="caption">
            {t(PLAYER.ITEM_TITLE_UPDATED_AT, {
              date: formatDate(item.updatedAt, {
                locale: i18n.language,
              }),
            })}
          </Typography>
        </Stack>
      </Stack>
      <TextDisplay content={item.description ?? ''} />
    </Stack>
  );
};
export default SectionHeader;
