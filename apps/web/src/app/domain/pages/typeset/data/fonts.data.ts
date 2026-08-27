import type { TypesetFont } from '../models/typeset.model';

/**
 * The families the builder offers, self-hosted through `@fontsource-variable`.
 *
 * Display faces are deliberately absent — Playfair Display, EB Garamond and
 * Instrument Serif read badly at body size, and a builder that lets you pick
 * them for body text is a builder that produces bad presets.
 */
export const TYPESET_FONTS: readonly TypesetFont[] = [
  {
    id: 'geist',
    label: 'Geist',
    type: 'sans',
    family: "'Geist Variable', sans-serif",
    cssVariable: '--font-geist',
    dependency: '@fontsource-variable/geist',
  },
  {
    id: 'inter',
    label: 'Inter',
    type: 'sans',
    family: "'Inter Variable', sans-serif",
    cssVariable: '--font-inter',
    dependency: '@fontsource-variable/inter',
  },
  {
    id: 'noto-sans',
    label: 'Noto Sans',
    type: 'sans',
    family: "'Noto Sans Variable', sans-serif",
    cssVariable: '--font-noto-sans',
    dependency: '@fontsource-variable/noto-sans',
  },
  {
    id: 'nunito-sans',
    label: 'Nunito Sans',
    type: 'sans',
    family: "'Nunito Sans Variable', sans-serif",
    cssVariable: '--font-nunito-sans',
    dependency: '@fontsource-variable/nunito-sans',
  },
  {
    id: 'figtree',
    label: 'Figtree',
    type: 'sans',
    family: "'Figtree Variable', sans-serif",
    cssVariable: '--font-figtree',
    dependency: '@fontsource-variable/figtree',
  },
  {
    id: 'roboto',
    label: 'Roboto',
    type: 'sans',
    family: "'Roboto Variable', sans-serif",
    cssVariable: '--font-roboto',
    dependency: '@fontsource-variable/roboto',
  },
  {
    id: 'raleway',
    label: 'Raleway',
    type: 'sans',
    family: "'Raleway Variable', sans-serif",
    cssVariable: '--font-raleway',
    dependency: '@fontsource-variable/raleway',
  },
  {
    id: 'dm-sans',
    label: 'DM Sans',
    type: 'sans',
    family: "'DM Sans Variable', sans-serif",
    cssVariable: '--font-dm-sans',
    dependency: '@fontsource-variable/dm-sans',
  },
  {
    id: 'public-sans',
    label: 'Public Sans',
    type: 'sans',
    family: "'Public Sans Variable', sans-serif",
    cssVariable: '--font-public-sans',
    dependency: '@fontsource-variable/public-sans',
  },
  {
    id: 'outfit',
    label: 'Outfit',
    type: 'sans',
    family: "'Outfit Variable', sans-serif",
    cssVariable: '--font-outfit',
    dependency: '@fontsource-variable/outfit',
  },
  {
    id: 'oxanium',
    label: 'Oxanium',
    type: 'sans',
    family: "'Oxanium Variable', sans-serif",
    cssVariable: '--font-oxanium',
    dependency: '@fontsource-variable/oxanium',
  },
  {
    id: 'manrope',
    label: 'Manrope',
    type: 'sans',
    family: "'Manrope Variable', sans-serif",
    cssVariable: '--font-manrope',
    dependency: '@fontsource-variable/manrope',
  },
  {
    id: 'space-grotesk',
    label: 'Space Grotesk',
    type: 'sans',
    family: "'Space Grotesk Variable', sans-serif",
    cssVariable: '--font-space-grotesk',
    dependency: '@fontsource-variable/space-grotesk',
  },
  {
    id: 'montserrat',
    label: 'Montserrat',
    type: 'sans',
    family: "'Montserrat Variable', sans-serif",
    cssVariable: '--font-montserrat',
    dependency: '@fontsource-variable/montserrat',
  },
  {
    id: 'ibm-plex-sans',
    label: 'IBM Plex Sans',
    type: 'sans',
    family: "'IBM Plex Sans Variable', sans-serif",
    cssVariable: '--font-ibm-plex-sans',
    dependency: '@fontsource-variable/ibm-plex-sans',
  },
  {
    id: 'source-sans-3',
    label: 'Source Sans 3',
    type: 'sans',
    family: "'Source Sans 3 Variable', sans-serif",
    cssVariable: '--font-source-sans-3',
    dependency: '@fontsource-variable/source-sans-3',
  },
  {
    id: 'instrument-sans',
    label: 'Instrument Sans',
    type: 'sans',
    family: "'Instrument Sans Variable', sans-serif",
    cssVariable: '--font-instrument-sans',
    dependency: '@fontsource-variable/instrument-sans',
  },
  {
    id: 'jetbrains-mono',
    label: 'JetBrains Mono',
    type: 'mono',
    family: "'JetBrains Mono Variable', monospace",
    cssVariable: '--font-jetbrains-mono',
    dependency: '@fontsource-variable/jetbrains-mono',
  },
  {
    id: 'geist-mono',
    label: 'Geist Mono',
    type: 'mono',
    family: "'Geist Mono Variable', monospace",
    cssVariable: '--font-geist-mono',
    dependency: '@fontsource-variable/geist-mono',
  },
  {
    id: 'noto-serif',
    label: 'Noto Serif',
    type: 'serif',
    family: "'Noto Serif Variable', serif",
    cssVariable: '--font-noto-serif',
    dependency: '@fontsource-variable/noto-serif',
  },
  {
    id: 'roboto-slab',
    label: 'Roboto Slab',
    type: 'serif',
    family: "'Roboto Slab Variable', serif",
    cssVariable: '--font-roboto-slab',
    dependency: '@fontsource-variable/roboto-slab',
  },
  {
    id: 'merriweather',
    label: 'Merriweather',
    type: 'serif',
    family: "'Merriweather Variable', serif",
    cssVariable: '--font-merriweather',
    dependency: '@fontsource-variable/merriweather',
  },
  {
    id: 'lora',
    label: 'Lora',
    type: 'serif',
    family: "'Lora Variable', serif",
    cssVariable: '--font-lora',
    dependency: '@fontsource-variable/lora',
  },
];

/** The families offered for body and heading text. */
export const TEXT_FONTS: readonly TypesetFont[] = TYPESET_FONTS.filter(font => font.type !== 'mono');

/** The families offered for code. */
export const MONO_FONTS: readonly TypesetFont[] = TYPESET_FONTS.filter(font => font.type === 'mono');

export function findFont(id: string | null | undefined): TypesetFont | undefined {
  if (!id) return undefined;
  return TYPESET_FONTS.find(font => font.id === id);
}
