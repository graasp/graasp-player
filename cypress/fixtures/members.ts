import { Member, MemberType } from '@graasp/sdk';

export const MEMBERS: { [key: string]: Member } = {
  ANNA: {
    id: 'anna-id',
    name: 'anna',
    email: 'anna@email.com',
    type: MemberType.Individual,
    extra: {},
    createdAt: new Date(Date.parse('2022-02-04T13:45:56Z')),
    updatedAt: new Date(Date.parse('2022-02-04T13:45:56Z')),
  },
  BOB: {
    id: 'bob-id',
    name: 'bob',
    email: 'bob@email.com',
    type: MemberType.Individual,
    extra: {},
    createdAt: new Date(Date.parse('2022-02-04T13:45:56Z')),
    updatedAt: new Date(Date.parse('2022-02-04T13:45:56Z')),
  },
  CEDRIC: {
    id: 'cedric-id',
    name: 'cedric',
    email: 'cedric@email.com',
    type: MemberType.Individual,
    extra: {},
    createdAt: new Date(Date.parse('2022-02-04T13:45:56Z')),
    updatedAt: new Date(Date.parse('2022-02-04T13:45:56Z')),
  },
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
