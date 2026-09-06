import type { Tx } from "../data/mock";

const money = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** "ETB 12,450.00" */
export const fmtETB = (n: number) => `ETB ${money.format(Math.abs(n))}`;

/** "12,450.00" — bare number, for the "16.00ETB" device-style lockup */
export const fmtNum = (n: number) => money.format(Math.abs(n));

/** "-ETB 500.00" / "+ETB 1,200.00" */
export const fmtSigned = (n: number) =>
  `${n < 0 ? "−" : "+"} ETB ${money.format(Math.abs(n))}`;

export const fmtTime = (ts: number) =>
  new Date(ts).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });

export const fmtDate = (ts: number) =>
  new Date(ts).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

/** "2026/09/03 16:09:06" — device receipt timestamp, from the real transaction moment */
export function fmtReceiptStamp(ts: number) {
  const d = new Date(ts);
  const p = (n: number) => String(n).padStart(2, "0");
  return (
    `${d.getFullYear()}/${p(d.getMonth() + 1)}/${p(d.getDate())} ` +
    `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`
  );
}

const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

/** "Today" | "Yesterday" | "Aug 29" — labels via translator */
export function dayLabel(ts: number, t: (k: string) => string) {
  const d = new Date(ts);
  const now = new Date();
  if (sameDay(d, now)) return t("day.today");
  const y = new Date(now.getTime() - 24 * 3600 * 1000);
  if (sameDay(d, y)) return t("day.yesterday");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export interface TxGroup {
  label: string;
  items: Tx[];
}

export function groupByDay(txs: Tx[], t: (k: string) => string): TxGroup[] {
  const map = new Map<string, Tx[]>();
  for (const tx of txs) {
    const label = dayLabel(tx.ts, t);
    if (!map.has(label)) map.set(label, []);
    map.get(label)!.push(tx);
  }
  return Array.from(map.entries()).map(([label, items]) => ({ label, items }));
}

const PALETTE = ["#168A45", "#D98A00", "#2B7CD3", "#7C5CE0", "#0E9488", "#C24E7E", "#B8541D", "#4C7A16"];

export function nameColor(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return PALETTE[h % PALETTE.length];
}

export function initials(name: string) {
  const p = name.trim().split(/\s+/);
  return ((p[0]?.[0] ?? "") + (p[1]?.[0] ?? "")).toUpperCase();
}
