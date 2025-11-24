import { ZardPreset } from './config.types';
import { GRAY } from './styles/gray';
import { NEUTRAL } from './styles/neutral';
import { SLATE } from './styles/slate';
import { STONE } from './styles/stone';
import { ZINC } from './styles/zinc';

export const updatePreset = (preset: ZardPreset): string => {
  switch (preset) {
    case ZardPreset.GRAY:
      return GRAY;
    case ZardPreset.SLATE:
      return SLATE;
    case ZardPreset.STONE:
      return STONE;
    case ZardPreset.ZINC:
      return ZINC;
    default:
      return NEUTRAL;
  }
};
