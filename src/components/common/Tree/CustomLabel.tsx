import { FC } from 'react';

import { ItemType, UnknownExtra } from '@graasp/sdk';
import { ItemIcon } from '@graasp/ui';

type Props = {
  extra: UnknownExtra;
  type: ItemType;
  text: string;
};

const CustomLabel: FC<Props> = ({ text, extra, type }) => (
  <div>
    <ItemIcon
      alt={`${text} icon`}
      // todo: replace this icon with a custom icon
      sx={{ mb: '-2px', mr: 1, fontSize: '1rem' }}
      type={type}
      extra={extra}
    />
    {text}
  </div>
);

export default CustomLabel;
