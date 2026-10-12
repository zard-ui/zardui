import { CREATE_EXAMPLES } from './create-examples';
import { BLOCK_ITEM_PREFIX, CANVAS_ITEMS, COMPONENT_ITEM_PREFIX, isCanvasItem } from './create.protocol';

export interface CreateItem {
  /** The value of the `item` URL param. */
  readonly id: string;
  readonly label: string;
  readonly group: 'Components' | 'Blocks';
}

/** The overview is one item, as on shadcn/ui; its two canvases are picked with the 01/02 switcher, not here. */
export const PREVIEW_ITEM: CreateItem = { id: CANVAS_ITEMS[0], label: 'Preview', group: 'Blocks' };

/** Every component shadcn/ui has an examples page for and zard has too, each previewable alone. */
export const COMPONENT_LIST: readonly CreateItem[] = CREATE_EXAMPLES.map(example => ({
  id: `${COMPONENT_ITEM_PREFIX}${example.name}`,
  label: example.title,
  group: 'Components' as const,
}));

/** The blocks, loaded on demand: their registry pulls every block's code in with it. */
export async function loadBlockItems(): Promise<readonly CreateItem[]> {
  const { BLOCKS_REGISTRY } = await import('@doc/domain/config/blocks-registry');

  return Object.values(BLOCKS_REGISTRY)
    .flat()
    .map(block => ({ id: `${BLOCK_ITEM_PREFIX}${block.id}`, label: block.title, group: 'Blocks' as const }));
}

export function itemLabel(id: string, blocks: readonly CreateItem[] = []): string {
  if (isCanvasItem(id)) return PREVIEW_ITEM.label;
  return [...COMPONENT_LIST, ...blocks].find(item => item.id === id)?.label ?? id;
}
