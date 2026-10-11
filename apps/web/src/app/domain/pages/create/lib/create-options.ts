import {
  ACCENT_COLORS,
  BASE_COLORS,
  BASE_COLOR_TOKENS,
  FONTS,
  ICON_LIBRARIES,
  INHERIT_FONT,
  MENU_ACCENTS,
  RADII,
  STYLES,
  THEME_COLOR_TOKENS,
  fontById,
  isBaseColor,
} from '@zard/design';
import type { DesignConfig, DesignConstraints, FontKind } from '@zard/design';

import type { PickerEvent, PickerOption, PickerSection } from './picker.types';

/** The ids of the customizer's rows, in the order they appear. */
export type PickerId =
  | 'style'
  | 'baseColor'
  | 'theme'
  | 'chartColor'
  | 'fontHeading'
  | 'font'
  | 'iconLibrary'
  | 'radius'
  | 'menu'
  | 'menuAccent';

const titleCase = (value: string): string => value.charAt(0).toUpperCase() + value.slice(1);

const KIND_LABELS: Record<FontKind, string> = { sans: 'Sans', mono: 'Mono', serif: 'Serif' };

const one = (id: string, value: string, options: readonly PickerOption[]): PickerSection[] => [{ id, value, options }];

export function styleSections(design: DesignConfig): PickerSection[] {
  return one(
    'style',
    design.style,
    STYLES.map(style => ({ value: style.value, label: style.label })),
  );
}

export function baseColorSections(design: DesignConfig): PickerSection[] {
  return one(
    'baseColor',
    design.baseColor,
    BASE_COLORS.map(color => ({ value: color.value, label: color.label })),
  );
}

/** The themes (or chart colors): the base color on its own, a separator, then the accents. */
export function themeSections(
  id: 'theme' | 'chartColor',
  design: DesignConfig,
  constraints: DesignConstraints,
): PickerSection[] {
  const valid = new Set<string>(id === 'theme' ? constraints.themes : constraints.chartColors);
  const option = (value: string): PickerOption => ({ value, label: titleCase(value), disabled: !valid.has(value) });

  return [
    { id, value: design[id], options: [option(design.baseColor)], separatorAfter: true },
    { id, value: design[id], options: ACCENT_COLORS.map(color => option(color.value)) },
  ];
}

export function fontSections(id: 'font' | 'fontHeading', design: DesignConfig): PickerSection[] {
  const groups = (['sans', 'mono', 'serif'] as const).map<PickerSection>(kind => ({
    id,
    label: KIND_LABELS[kind],
    value: design[id],
    options: FONTS.filter(font => font.kind === kind).map(font => ({ value: font.id, label: font.label })),
  }));

  if (id === 'font') return groups;

  return [
    {
      id,
      value: design[id],
      options: [{ value: INHERIT_FONT, label: fontById(design.font)?.label ?? 'Body font' }],
      separatorAfter: true,
    },
    ...groups,
  ];
}

export function iconSections(design: DesignConfig): PickerSection[] {
  return one(
    'iconLibrary',
    design.iconLibrary,
    ICON_LIBRARIES.map(library => ({ value: library.value, label: library.label })),
  );
}

export function radiusSections(design: DesignConfig, constraints: DesignConstraints): PickerSection[] {
  const option = (radius: (typeof RADII)[number]): PickerOption => ({
    value: radius.value,
    label: radius.label,
    disabled: constraints.disabledRadii.includes(radius.value) && radius.value !== design.radius,
  });
  const [first, ...rest] = RADII;

  return [
    { id: 'radius', value: design.radius, options: first ? [option(first)] : [], separatorAfter: true },
    { id: 'radius', value: design.radius, options: rest.map(option) },
  ];
}

export function menuSections(design: DesignConfig, constraints: DesignConstraints): PickerSection[] {
  return [
    {
      id: 'color',
      label: 'Color',
      value: design.menuColor,
      separatorAfter: true,
      options: [
        { value: 'default', label: 'Default' },
        { value: 'inverted', label: 'Inverted', disabled: constraints.disabledMenuColors.includes('inverted') },
      ],
    },
    {
      id: 'appearance',
      label: 'Appearance',
      value: design.menuAppearance,
      options: [
        { value: 'solid', label: 'Solid' },
        { value: 'translucent', label: 'Translucent' },
      ],
    },
  ];
}

export function accentSections(design: DesignConfig, constraints: DesignConstraints): PickerSection[] {
  return one(
    'menuAccent',
    design.menuAccent,
    MENU_ACCENTS.map(accent => ({
      value: accent.value,
      label: accent.label,
      disabled: constraints.disabledMenuAccents.includes(accent.value),
    })),
  );
}

// --- Display ----------------------------------------------------------------------------------

export function styleLabel(design: DesignConfig): string {
  return STYLES.find(style => style.value === design.style)?.label ?? design.style;
}

export function fontLabel(id: string): string {
  return fontById(id)?.label ?? id;
}

/** What the heading row reads: the body font's name while it inherits it. */
export function headingLabel(design: DesignConfig): string {
  return fontLabel(design.fontHeading === INHERIT_FONT ? design.font : design.fontHeading);
}

export function iconLibraryLabel(design: DesignConfig): string {
  return ICON_LIBRARIES.find(library => library.value === design.iconLibrary)?.label ?? design.iconLibrary;
}

export function radiusLabel(design: DesignConfig): string {
  return RADII.find(radius => radius.value === design.radius)?.label ?? design.radius;
}

export function menuLabel(design: DesignConfig): string {
  return `${titleCase(design.menuColor)} / ${titleCase(design.menuAppearance)}`;
}

export function accentLabel(design: DesignConfig): string {
  return titleCase(design.menuAccent);
}

export function fontFamily(id: string): string | null {
  return fontById(id)?.family ?? null;
}

/** The family the heading row draws its "Aa" in. */
export function headingFamily(design: DesignConfig): string | null {
  return fontFamily(design.fontHeading === INHERIT_FONT ? design.font : design.fontHeading);
}

/** The color of a row's dot, taken from the dark tokens — the customizer is always dark. */
export function colorDot(kind: 'base' | 'theme' | 'chart', id: string): string {
  if (kind === 'chart') {
    const tokens = isBaseColor(id) ? BASE_COLOR_TOKENS[id] : THEME_COLOR_TOKENS[id];
    return tokens?.dark['chart-2'] ?? 'currentColor';
  }

  if (isBaseColor(id)) return BASE_COLOR_TOKENS[id]?.dark['muted-foreground'] ?? 'currentColor';
  return kind === 'theme' ? (THEME_COLOR_TOKENS[id]?.dark['primary'] ?? 'currentColor') : 'currentColor';
}

// --- Events -----------------------------------------------------------------------------------

/** The change a picker event stands for — committed on click, previewed on hover. */
export function changeFor(picker: PickerId, event: PickerEvent): Partial<DesignConfig> {
  switch (picker) {
    case 'menu':
      return event.section === 'color'
        ? { menuColor: event.value as DesignConfig['menuColor'] }
        : { menuAppearance: event.value as DesignConfig['menuAppearance'] };
    default:
      return { [picker]: event.value } as Partial<DesignConfig>;
  }
}
