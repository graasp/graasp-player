import { DiscriminatedItem, ItemTag } from '@graasp/sdk';

export type MockItemTag = Omit<ItemTag, 'item'>;
export type MockItem = DiscriminatedItem & {
  // for testing
  filepath?: string;
  // path to a fixture file in cypress
  filefixture?: string;
  memberships?: { memberId: string }[];
  tags?: MockItemTag[];
};
