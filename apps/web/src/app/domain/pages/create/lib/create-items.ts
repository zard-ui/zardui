import { COMPONENTS_REGISTRY } from '@doc/shared/constants/components.constant';

import { BLOCK_ITEM_PREFIX, CANVAS_ITEMS, COMPONENT_ITEM_PREFIX } from './create.protocol';

export interface CreateItem {
  /** The value of the `item` URL param. */
  readonly id: string;
  readonly label: string;
  readonly group: 'Canvas' | 'Components' | 'Blocks';
}

const words = (slug: string): string =>
  slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

export const CANVAS_LIST: readonly CreateItem[] = [
  { id: CANVAS_ITEMS[0], label: 'Overview 01', group: 'Canvas' },
  { id: CANVAS_ITEMS[1], label: 'Overview 02', group: 'Canvas' },
];

/** Every component of the docs, each previewable alone. */
export const COMPONENT_LIST: readonly CreateItem[] = COMPONENTS_REGISTRY.map(entry => ({
  id: `${COMPONENT_ITEM_PREFIX}${entry.componentName}`,
  label: words(entry.componentName),
  group: 'Components' as const,
})).sort((a, b) => a.label.localeCompare(b.label));

/** The blocks, loaded on demand: their registry pulls every block's code in with it. */
export async function loadBlockItems(): Promise<readonly CreateItem[]> {
  const { BLOCKS_REGISTRY } = await import('@doc/domain/config/blocks-registry');

  return Object.values(BLOCKS_REGISTRY)
    .flat()
    .map(block => ({ id: `${BLOCK_ITEM_PREFIX}${block.id}`, label: block.title, group: 'Blocks' as const }));
}

export function itemLabel(id: string, blocks: readonly CreateItem[] = []): string {
  return [...CANVAS_LIST, ...COMPONENT_LIST, ...blocks].find(item => item.id === id)?.label ?? id;
}
