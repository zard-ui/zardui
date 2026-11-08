function clamp(value: number, [min, max]: [number, number]): number {
  return Math.min(max, Math.max(min, value));
}

function getDecimalCount(value: number): number {
  // also handles exponent notation such as 1e-7
  const [mantissa, exponent = '0'] = String(value).split('e');
  return Math.max(0, (mantissa.split('.')[1] ?? '').length - Number(exponent));
}

function roundToStep(value: number, min: number, step: number): number {
  const stepped = Math.round((value - min) / step) * step + min;
  // drop floating point noise such as 0.30000000000000004 by keeping the precision of step and min
  const decimals = Math.max(getDecimalCount(step), getDecimalCount(min));
  return Number(stepped.toFixed(decimals));
}

function convertValueToPercentage(value: number, min: number, max: number): number {
  return ((value - min) / (max - min)) * 100;
}

export { clamp, roundToStep, convertValueToPercentage };
