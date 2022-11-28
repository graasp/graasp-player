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
      sx={{ pt: 1, mr: 1 }}
      type={type}
      extra={extra}
    />
    {text}
  </div>
);

export default CustomLabel;
