import { TableState, ZardTableDataSource } from './table';

export const MOCK_MOVIES: Array<Record<string, string | number>> = [
  { id: 1, title: 'The Shawshank Redemption', director: 'Frank Darabont', year: 1994 },
  { id: 2, title: 'The Godfather', director: 'Francis Ford Coppola', year: 1972 },
  { id: 3, title: 'The Dark Knight', director: 'Christopher Nolan', year: 2008 },
  { id: 4, title: 'Pulp Fiction', director: 'Quentin Tarantino', year: 1994 },
  { id: 5, title: "Schindler's List", director: 'Steven Spielberg', year: 1993 },
  { id: 6, title: 'Fight Club', director: 'David Fincher', year: 1999 },
  { id: 7, title: 'Forrest Gump', director: 'Robert Zemeckis', year: 1994 },
  { id: 8, title: 'Inception', director: 'Christopher Nolan', year: 2010 },
  { id: 9, title: 'The Matrix', director: 'The Wachowskis', year: 1999 },
  { id: 10, title: 'Goodfellas', director: 'Martin Scorsese', year: 1990 },
  { id: 11, title: 'Se7en', director: 'David Fincher', year: 1995 },
  { id: 12, title: 'The Silence of the Lambs', director: 'Jonathan Demme', year: 1991 },
  { id: 13, title: 'Saving Private Ryan', director: 'Steven Spielberg', year: 1998 },
  { id: 14, title: 'Interstellar', director: 'Christopher Nolan', year: 2014 },
  { id: 15, title: 'Gladiator', director: 'Ridley Scott', year: 2000 },
  { id: 16, title: 'The Green Mile', director: 'Frank Darabont', year: 1999 },
  { id: 17, title: 'The Departed', director: 'Martin Scorsese', year: 2006 },
  { id: 18, title: 'Whiplash', director: 'Damien Chazelle', year: 2014 },
  { id: 19, title: 'Parasite', director: 'Bong Joon-ho', year: 2019 },
  { id: 20, title: 'Joker', director: 'Todd Phillips', year: 2019 },
];

export function mockFetchUsers(state: TableState): Promise<ZardTableDataSource<Record<string, string | number>>> {
  const { pageIndex, pageSize, field, direction, search } = state;
  const start = pageIndex * pageSize;
  const end = start + pageSize;
  const filterFields = ['title', 'director'];

  let filtered = MOCK_MOVIES;
  if (search && search.trim() !== '') {
    const lowerSearch = search.toLowerCase();
    filtered = MOCK_MOVIES.filter(user =>
      filterFields.some(key => {
        const val = user[key];
        return val != null && String(val).toLowerCase().includes(lowerSearch);
      }),
    );
  }

  const sorted = [...filtered].sort((a, b) => {
    const valA = a[field ?? 'title'];
    const valB = b[field ?? 'title'];

    if (valA == null || valB == null) return 0;

    const compare = typeof valA === 'number' && typeof valB === 'number' ? valA - valB : String(valA).localeCompare(String(valB));

    return direction === 'desc' ? -compare : compare;
  });

  const paginated = sorted.slice(start, end);

  return Promise.resolve({
    data: paginated,
    meta: {
      pagination: {
        totalItems: filtered.length,
        pageSize,
        pageIndex,
        first: pageIndex === 0,
        last: end >= filtered.length,
      },
      sorting: {
        field: field ?? 'title',
        direction: direction ?? 'asc',
      },
      filtering: {
        search: search ?? '',
      },
    },
  });
}
