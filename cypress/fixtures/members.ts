import { Member, MemberFactory } from '@graasp/sdk';

export const MEMBERS: { [key: string]: Member } = {
  ANNA: MemberFactory({
    id: 'anna-id',
    name: 'anna',
    email: 'anna@email.com',
  }),
  BOB: MemberFactory({
    id: 'bob-id',
    name: 'bob',
    email: 'bob@email.com',
  }),
  CEDRIC: MemberFactory({
    id: 'cedric-id',
    name: 'cedric',
    email: 'cedric@email.com',
  }),
};

export const CURRENT_USER = MEMBERS.ANNA;

export const MOCK_SESSIONS = [
  { id: MEMBERS.BOB.id, token: 'bob-token', createdAt: Date.now() },
  {
    id: MEMBERS.CEDRIC.id,
    token: 'cedric-token',
    createdAt: Date.now(),
  },
];
