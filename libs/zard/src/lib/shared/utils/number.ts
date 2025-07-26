function clamp(value: number, [min, max]: [number, number]): number {
  return Math.min(max, Math.max(min, value));
}

function roundToStep(value: number, min: number, step: number): number {
  return Math.round((value - min) / step) * step + min;
}

function convertValueToPercentage(value: number, min: number, max: number): number {
  return ((value - min) / (max - min)) * 100;
}

export { clamp, roundToStep, convertValueToPercentage };
