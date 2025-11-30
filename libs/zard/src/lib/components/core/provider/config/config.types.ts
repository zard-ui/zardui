export enum ZardPreset {
  GRAY = 'gray',
  NEUTRAL = 'neutral',
  SLATE = 'slate',
  STONE = 'stone',
  ZINC = 'zinc',
}

export type ThemeType = { preset?: ZardPreset } | undefined;
export type ThemeConfigType = {
  theme?: ThemeType;
};
export type ZardConfigType = {} & ThemeConfigType;
