import { TableState, ZardTableDataSource } from './table';

export interface User {
  name: string;
  age: number;
  address: string;
}

export const MOCK_USERS: Array<Record<string, string | number>> = [
  { name: 'Jim Brown', age: 32, email: 'jim@example.com' },
  { name: 'Dwight', age: 29, email: 'dwight@example.com' },
  { name: 'Earl', age: 46, email: 'earl@example.com' },
  { name: 'Fineas', age: 18, email: 'fineas@example.com' },
  { name: 'Gus', age: 54, email: 'gus@example.com' },
  { name: 'Hank', age: 41, email: 'hank@example.com' },
  { name: 'Ivy', age: 22, email: 'ivy@example.com' },
  { name: 'Jack', age: 35, email: 'jack@example.com' },
  { name: 'Kara', age: 27, email: 'kara@example.com' },
  { name: 'Liam', age: 30, email: 'liam@example.com' },
  { name: 'Mia', age: 24, email: 'mia@example.com' },
  { name: 'Noah', age: 33, email: 'noah@example.com' },
  { name: 'Olivia', age: 28, email: 'olivia@example.com' },
  { name: 'Paul', age: 39, email: 'paul@example.com' },
  { name: 'Quinn', age: 21, email: 'quinn@example.com' },
  { name: 'Rita', age: 37, email: 'rita@example.com' },
  { name: 'Sam', age: 26, email: 'sam@example.com' },
  { name: 'Tina', age: 31, email: 'tina@example.com' },
  { name: 'Ursula', age: 45, email: 'ursula@example.com' },
  { name: 'Victor', age: 38, email: 'victor@example.com' },
];

export function mockFetchUsers(state: TableState): Promise<ZardTableDataSource<Record<string, string | number>>> {
  const { pageIndex, pageSize } = state;
  const start = pageIndex * pageSize;
  const end = start + pageSize;

  return Promise.resolve({
    data: MOCK_USERS.slice(start, end),
    meta: {
      pagination: {
        totalItems: MOCK_USERS.length,
        pageSize,
        pageIndex,
        first: pageIndex === 0,
        last: end >= MOCK_USERS.length,
      },
    },
  });
}
