export function getPercentage(value: number, min: number, max: number): number {
  const range = max - min;
  return range === 0 ? 0 : ((value - min) / range) * 100;
}
