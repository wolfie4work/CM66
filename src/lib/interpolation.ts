export function interpol(table: [number, number][], x: number): number {
  const i = table.findIndex(([xi]) => xi >= x);
  if (i === 0) return table[0][1];
  if (i === -1) return table.at(-1)![1];
  const [x0, y0] = table[i - 1];
  const [x1, y1] = table[i];
  return y0 + (y1 - y0) * (x - x0) / (x1 - x0);
}
