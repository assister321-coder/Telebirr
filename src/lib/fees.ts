/**
 * Tiered service fee applied on top of the amount being sent.
 *
 *   under 100 ............ + 1 birr
 *   100 – 200 ............ + 2 birr
 *   200 – 300 ............ + 3 birr
 *   300 – 400 ............ + 4 birr
 *   400 – 500 ............ + 5 birr
 *   above 500 ............ + 10 birr
 */
export function serviceFee(amount: number): number {
  const a = Math.abs(amount || 0);
  if (a <= 0) return 0;
  if (a < 100) return 1;
  if (a <= 200) return 2;
  if (a <= 300) return 3;
  if (a <= 400) return 4;
  if (a <= 500) return 5;
  return 10;
}

/** Amount + tiered fee = what actually leaves the wallet. */
export const totalWithFee = (amount: number) => Math.abs(amount || 0) + serviceFee(amount);

/** Human-readable band label, e.g. "400 – 500" */
export function feeBand(amount: number): string {
  const a = Math.abs(amount || 0);
  if (a <= 0) return "—";
  if (a < 100) return "< 100";
  if (a <= 200) return "100 – 200";
  if (a <= 300) return "200 – 300";
  if (a <= 400) return "300 – 400";
  if (a <= 500) return "400 – 500";
  return "> 500";
}
