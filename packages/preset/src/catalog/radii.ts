/**
 * Os raios oferecidos, do mais reto ao mais redondo.
 *
 * `default` é `0.625rem` porque é o valor que os cinco tons neutros já gravavam
 * em `--radius`; os outros quatro são os degraus em volta dele. A ordem dos
 * `code` acompanha a do catálogo de propósito — aqui a sequência é a própria
 * grandeza, então um `code` fora de ordem seria só ruído.
 */

import type { RadiusEntry } from '../types.js';

export const RADII: readonly RadiusEntry[] = [
  { id: 'none', code: 0, label: 'None', value: '0rem' },
  { id: 'small', code: 1, label: 'Small', value: '0.3rem' },
  { id: 'medium', code: 2, label: 'Medium', value: '0.5rem' },
  { id: 'default', code: 3, label: 'Default', value: '0.625rem' },
  { id: 'large', code: 4, label: 'Large', value: '1rem' },
];
