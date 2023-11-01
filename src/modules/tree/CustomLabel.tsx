import { FC } from 'react';

import { Stack } from '@mui/material';

import {
  DiscriminatedItem,
  ItemType,
  LocalFileItemExtra,
  S3FileItemExtra,
} from '@graasp/sdk';
import { ItemIcon } from '@graasp/ui';

type Props = {
  text: string;
  type: DiscriminatedItem['type'];
  extra?: DiscriminatedItem['extra'];
};

const CustomLabel: FC<Props> = ({ text, extra, type }) => (
  <Stack direction="row">
    <ItemIcon
      alt={`${text} icon`}
      // todo: replace this icon with a custom icon
      sx={{ mt: 0.5, mr: 1, fontSize: '1rem' }}
      type={type}
      extra={
        type === ItemType.LOCAL_FILE || type === ItemType.S3_FILE
          ? (extra as LocalFileItemExtra | S3FileItemExtra)
          : undefined
      }
    />
    {text}
  </Stack>
);

export default CustomLabel;
