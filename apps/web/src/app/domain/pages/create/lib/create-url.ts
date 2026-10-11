import { DESIGN_FIELDS, DEFAULT_DESIGN, encodePreset, normalizeDesign, tryDecodePreset } from '@zard/design';
import type { DesignConfig, DesignField } from '@zard/design';

import { DEFAULT_ITEM } from './create.protocol';

/** The slice of Angular's `ParamMap` this module needs, so it can be tested with a plain object. */
export interface ParamsLike {
  readonly keys: readonly string[];
  get(name: string): string | null;
}

export interface ParsedCreateUrl {
  readonly design: DesignConfig;
  readonly item: string;
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

  const design = normalizeDesign({ ...base, ...overrides });
  const item = params.get('item') || DEFAULT_ITEM;

  const extraKeys = params.keys.some(key => key !== 'preset' && key !== 'item');
  const needsCanonicalization =
    !decoded?.ok || decoded.code !== presetParam || extraKeys || params.get('item') === DEFAULT_ITEM;

  return { design, item, needsCanonicalization };
}

/** The canonical query: `preset` always, `item` only when it is not the default canvas. */
export function serializeCreateParams(design: DesignConfig, item: string): Record<string, string> {
  const query: Record<string, string> = { preset: encodePreset(design) };
  if (item && item !== DEFAULT_ITEM) query['item'] = item;
  return query;
}
