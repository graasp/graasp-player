export const MEMBERS = {
  ANNA: { id: 'anna-id', name: 'anna', email: 'anna@email.com' },
  BOB: { id: 'bob-id', name: 'bob', email: 'bob@email.com' },
  CEDRIC: { id: 'cedric-id', name: 'cedric', email: 'cedric@email.com' },
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
