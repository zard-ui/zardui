import { TableState, ZardTableDataSource } from './table';

export interface User {
  name: string;
  age: number;
  address: string;
}

export const MOCK_USERS: Array<Record<string, string | number>> = [
  { id: 1, name: 'Jim Brown', age: 32, email: 'jim@example.com' },
  { id: 2, name: 'Dwight', age: 29, email: 'dwight@example.com' },
  { id: 3, name: 'Earl', age: 46, email: 'earl@example.com' },
  { id: 4, name: 'Fineas', age: 18, email: 'fineas@example.com' },
  { id: 5, name: 'Gus', age: 54, email: 'gus@example.com' },
  { id: 6, name: 'Hank', age: 41, email: 'hank@example.com' },
  { id: 7, name: 'Ivy', age: 22, email: 'ivy@example.com' },
  { id: 8, name: 'Jack', age: 35, email: 'jack@example.com' },
  { id: 9, name: 'Kara', age: 27, email: 'kara@example.com' },
  { id: 10, name: 'Liam', age: 30, email: 'liam@example.com' },
  { id: 11, name: 'Mia', age: 24, email: 'mia@example.com' },
  { id: 12, name: 'Noah', age: 33, email: 'noah@example.com' },
  { id: 13, name: 'Olivia', age: 28, email: 'olivia@example.com' },
  { id: 14, name: 'Paul', age: 39, email: 'paul@example.com' },
  { id: 15, name: 'Quinn', age: 21, email: 'quinn@example.com' },
  { id: 16, name: 'Rita', age: 37, email: 'rita@example.com' },
  { id: 17, name: 'Sam', age: 26, email: 'sam@example.com' },
  { id: 18, name: 'Tina', age: 31, email: 'tina@example.com' },
  { id: 19, name: 'Ursula', age: 45, email: 'ursula@example.com' },
  { id: 20, name: 'Victor', age: 38, email: 'victor@example.com' },
];

export function mockFetchUsers(state: TableState): Promise<ZardTableDataSource<Record<string, string | number>>> {
  const { pageIndex, pageSize, field, direction, search } = state;
  const start = pageIndex * pageSize;
  const end = start + pageSize;
  const filterFields = ['name', 'email'];

  let filtered = MOCK_USERS;
  if (search && search.trim() !== '') {
    const lowerSearch = search.toLowerCase();
    filtered = MOCK_USERS.filter(user =>
      filterFields.some(key => {
        const val = user[key];
        return val != null && String(val).toLowerCase().includes(lowerSearch);
      }),
    );
  }

  // Ordena os dados filtrados
  const sorted = [...filtered].sort((a, b) => {
    const valA = a[field ?? 'name'];
    const valB = b[field ?? 'name'];

    if (valA == null || valB == null) return 0;

    const compare = typeof valA === 'number' && typeof valB === 'number' ? valA - valB : String(valA).localeCompare(String(valB));

    return direction === 'desc' ? -compare : compare;
  });

  // Paginacao sobre os dados filtrados e ordenados
  const paginated = sorted.slice(start, end);

  return Promise.resolve({
    data: paginated,
    meta: {
      pagination: {
        totalItems: filtered.length, // total de itens depois do filtro
        pageSize,
        pageIndex,
        first: pageIndex === 0,
        last: end >= filtered.length,
      },
      sorting: {
        field: field ?? 'name',
        direction: direction ?? 'asc',
      },
      filtering: {
        search: search ?? '',
      },
    },
  });
}
