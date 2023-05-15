import { ItemTagType, Member } from '@graasp/sdk';

import { v4 } from 'uuid';

import { CURRENT_USER } from './members';
import { MockItemTag } from './mockTypes';

// eslint-disable-next-line import/prefer-default-export
export const mockItemTag = ({
  creator = CURRENT_USER,
  type,
}: {
  type: ItemTagType;
  creator?: Member;
}): MockItemTag => ({
  id: v4(),
  type,
  createdAt: new Date(),
  creator,
});
