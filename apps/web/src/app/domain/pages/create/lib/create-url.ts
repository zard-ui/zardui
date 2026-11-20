import { DESIGN_FIELDS, DEFAULT_DESIGN, encodePreset, normalizeDesign, tryDecodePreset } from '@zard/design';
import type { DesignConfig, DesignField } from '@zard/design';

import { COMPONENT_LIST } from './create-items';
import { BLOCK_ITEM_PREFIX, DEFAULT_ITEM, isCanvasItem, MAP_ITEM_PREFIX } from './create.protocol';
import { CUSTOM_DESIGN_DEFAULTS, decodeCustomTheme, encodeCustomTheme, type CustomTheme } from './custom-theme';

/** The slice of Angular's `ParamMap` this module needs, so it can be tested with a plain object. */
export interface ParamsLike {
  readonly keys: readonly string[];
  get(name: string): string | null;
  /** Every value of a repeated param; optional so a plain object can stand in. */
  getAll?(name: string): string[];
}

export interface ParsedCreateUrl {
  readonly design: DesignConfig;
  readonly item: string;
  /** The hand-edited theme when Custom is on (`custom` in the URL), `null` when it is off. */
  readonly custom: CustomTheme | null;
  /** The URL is not in its canonical form: it has no valid `preset`, or carries params that fold into it. */
  readonly needsCanonicalization: boolean;
}

/** shadcn spelled the menu as one param; accept its composite values too. */
const LEGACY_MENU_COLORS: Record<string, Pick<DesignConfig, 'menuColor' | 'menuAppearance'>> = {
  'default-translucent': { menuColor: 'default', menuAppearance: 'translucent' },
  'inverted-translucent': { menuColor: 'inverted', menuAppearance: 'translucent' },
};

/**
 * The design and item a URL describes.
 *
 * `preset` is the base; individual params (`style=lyra`, …) are accepted on input and laid on top of it, then the
 * whole is normalized. A malformed or foreign preset falls back to the default design instead of failing.
 */
export function parseCreateParams(params: ParamsLike): ParsedCreateUrl {
  const presetParam = params.get('preset');
  const decoded = presetParam ? tryDecodePreset(presetParam) : null;
  const base: DesignConfig = decoded?.ok ? decoded.design : { ...DEFAULT_DESIGN };

  const overrides: Partial<Record<DesignField, unknown>> = {};
  for (const field of DESIGN_FIELDS) {
    const value = params.get(field);
    if (value === null) continue;

    const legacy = field === 'menuColor' ? LEGACY_MENU_COLORS[value] : undefined;
    if (legacy) Object.assign(overrides, legacy);
    else overrides[field] = value;
  }

  const customParam = params.get('custom');
  const custom = decodeCustomTheme(customParam);
  // Custom is CSS only: whatever the preset says about style, fonts, icons and menu is not part of it.
  const design = normalizeDesign({ ...base, ...overrides, ...(custom ? CUSTOM_DESIGN_DEFAULTS : {}) });
  const requestedItem = params.get('item');
  const item = requestedItem && isKnownItem(requestedItem) ? requestedItem : DEFAULT_ITEM;
  const repeated = (name: string) => (params.getAll?.(name).length ?? 0) > 1;

  const extraKeys = params.keys.some(key => key !== 'preset' && key !== 'item' && key !== 'custom');
  const needsCanonicalization =
    !decoded?.ok ||
    decoded.code !== presetParam ||
    extraKeys ||
    repeated('preset') ||
    repeated('item') ||
    repeated('custom') ||
    (custom !== null && (customParam !== encodeCustomTheme(custom) || encodePreset(design) !== presetParam)) ||
    (requestedItem !== null && (requestedItem !== item || item === DEFAULT_ITEM));

  return { design, item, custom, needsCanonicalization };
}

/**
 * Whether `item` can be shown. Blocks are checked only by their prefix: their list is a lazy chunk the URL parser does
 * not load, and the preview falls back to the canvas for a block it cannot find.
 */
function isKnownItem(item: string): boolean {
  if (isCanvasItem(item)) return true;
  if (item.startsWith(BLOCK_ITEM_PREFIX)) return item.length > BLOCK_ITEM_PREFIX.length;
  if (item.startsWith(MAP_ITEM_PREFIX)) return item.length > MAP_ITEM_PREFIX.length;
  return COMPONENT_LIST.some(component => component.id === item);
}

/**
 * The canonical query: `preset` always, `item` only when it is not the default canvas, `custom` only while Custom is
 * on (`~` before anything was changed).
 */
export function serializeCreateParams(
  design: DesignConfig,
  item: string,
  custom: CustomTheme | null = null,
): Record<string, string> {
  const query: Record<string, string> = { preset: encodePreset(design) };
  if (item && item !== DEFAULT_ITEM) query['item'] = item;
  if (custom) query['custom'] = encodeCustomTheme(custom);
  return query;
}
