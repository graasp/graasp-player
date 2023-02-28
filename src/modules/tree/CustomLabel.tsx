import { FC } from 'react';

import { Stack } from '@mui/material';

import { ItemType } from '@graasp/sdk';
import { ItemRecord } from '@graasp/sdk/frontend';
import { ItemIcon } from '@graasp/ui';

type Props = {
  text: string;
  type: `${ItemType}`;
  extra?: ItemRecord['extra'];
};

const CustomLabel: FC<Props> = ({ text, extra, type }) => (
  <Stack direction="row">
    <ItemIcon
      alt={`${text} icon`}
      // todo: replace this icon with a custom icon
      sx={{ mt: 0.5, mr: 1, fontSize: '1rem' }}
      type={type}
      extra={extra}
    />
    {text}
  </Stack>
);

export default CustomLabel;
