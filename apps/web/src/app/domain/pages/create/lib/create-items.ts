import { CREATE_EXAMPLES } from './create-examples';
import {
  BLOCK_ITEM_PREFIX,
  CANVAS_ITEMS,
  COMPONENT_ITEM_PREFIX,
  isCanvasItem,
  MAP_ITEM_PREFIX,
} from './create.protocol';

export interface CreateItem {
  /** The value of the `item` URL param. */
  readonly id: string;
  readonly label: string;
  readonly group: 'Components' | 'Blocks';
  /** Where a block sits in the Blocks list (`Sidebar`, `Login`, `Maps · Analytics`…); components have none. */
  readonly category?: string;
}

/** The overview is one item, as on shadcn/ui; its two canvases are picked with the 01/02 switcher, not here. */
export const PREVIEW_ITEM: CreateItem = { id: CANVAS_ITEMS[0], label: 'Preview', group: 'Blocks' };

/** Every component shadcn/ui has an examples page for and zard has too, each previewable alone. */
export const COMPONENT_LIST: readonly CreateItem[] = CREATE_EXAMPLES.map(example => ({
  id: `${COMPONENT_ITEM_PREFIX}${example.name}`,
  label: example.title,
  group: 'Components' as const,
}));

/** `sidebar-07` → `Sidebar`: a block's family is its id without the number. */
export function blockCategory(id: string): string {
  const family = id.replace(/-\d+$/, '').replace(/-/g, ' ');
  return family.charAt(0).toUpperCase() + family.slice(1);
}

/**
 * The blocks, then the maps of the /maps gallery, loaded on demand: their registries pull every block's code in with
 * them. Each comes with its category, in the order the categories first appear.
 */
export async function loadBlockItems(): Promise<readonly CreateItem[]> {
  const [{ BLOCKS_REGISTRY }, { MAP_BLOCKS }, { MAP_CATEGORIES }] = await Promise.all([
    import('@doc/domain/config/blocks-registry'),
    import('@doc/domain/config/maps-registry'),
    import('@doc/domain/services/maps.service'),
  ]);

  // The "featured" category is a showcase that repeats blocks of the others: each block is one item, in its family.
  const blocks = Object.values(BLOCKS_REGISTRY)
    .flat()
    .map((block): CreateItem => ({
      id: `${BLOCK_ITEM_PREFIX}${block.id}`,
      label: block.title,
      group: 'Blocks',
      category: blockCategory(block.id),
    }));
  const unique = [...new Map(blocks.map(item => [item.id, item])).values()];
  const families = [...new Set(unique.map(item => item.category))].sort();

  const maps = MAP_CATEGORIES.flatMap(category =>
    MAP_BLOCKS.filter(block => block.category === category.id).map((block): CreateItem => ({
      id: `${MAP_ITEM_PREFIX}${block.id}`,
      label: block.title,
      group: 'Blocks',
      category: `Maps · ${category.label}`,
    })),
  );

  return [...families.flatMap(family => unique.filter(item => item.category === family)), ...maps];
}

/** The items grouped by category, in order: what the Blocks list of Navigate shows. */
export function groupByCategory(items: readonly CreateItem[]): { category: string; items: CreateItem[] }[] {
  const groups = new Map<string, CreateItem[]>();
  for (const item of items) {
    const category = item.category ?? item.group;
    groups.set(category, [...(groups.get(category) ?? []), item]);
  }
  return [...groups].map(([category, grouped]) => ({ category, items: grouped }));
}

export function itemLabel(id: string, blocks: readonly CreateItem[] = []): string {
  if (isCanvasItem(id)) return PREVIEW_ITEM.label;
  return [...COMPONENT_LIST, ...blocks].find(item => item.id === id)?.label ?? id;
}
