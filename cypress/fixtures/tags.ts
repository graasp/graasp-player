import { ItemVisibilityType, Member } from '@graasp/sdk';

import { v4 } from 'uuid';

import { CURRENT_USER } from './members';
import { MockItemTag } from './mockTypes';

export const mockItemTag = ({
  creator = CURRENT_USER,
  type,
}: {
  type: ItemVisibilityType;
  creator?: Member;
}): MockItemTag => ({
  id: v4(),
  type,
  createdAt: new Date().toISOString(),
  creator,
});
export const mockHiddenTag = (creator?: Member): MockItemTag =>
  mockItemTag({ creator, type: ItemVisibilityType.Hidden });
export const mockPublicTag = (creator?: Member): MockItemTag =>
  mockItemTag({ creator, type: ItemVisibilityType.Public });
