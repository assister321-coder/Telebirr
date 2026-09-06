export type TxKind = "sent" | "received" | "bill" | "airtime" | "bank" | "merchant";

export interface Tx {
  id: string;
  kind: TxKind;
  /** Display name — counterparty or biller */
  title: string;
  phone?: string;
  /** signed amount: negative = money out (excludes fee) */
  amount: number;
  /** tiered service fee charged on top of the amount */
  fee?: number;
  ts: number;
  status: "Completed" | "Pending";
  method: string;
  /** biller id when kind === 'bill' */
  refId?: string;
  note?: string;
}

export interface Contact {
  name: string;
  phone: string;
}

const D = 24 * 3600 * 1000;

/** timestamp at a given time of day, n days ago */
const at = (daysAgo: number, h: number, m = 0) => {
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d.getTime() - daysAgo * D;
};

export function buildInitialTxs(): Tx[] {
  return [
    { id: "DEMO-849203", kind: "sent", title: "Abebe Kebede", phone: "+251 911 204 482", amount: -500, ts: at(0, 15, 42), status: "Completed", method: "Wallet" },
    { id: "DEMO-847719", kind: "received", title: "Hana Ali", phone: "+251 912 845 117", amount: 1200, ts: at(0, 11, 5), status: "Completed", method: "Wallet" },
    { id: "DEMO-845510", kind: "airtime", title: "Ethio Telecom", phone: "+251 911 223 344", amount: -100, ts: at(1, 18, 21), status: "Completed", method: "Wallet" },
    { id: "DEMO-844002", kind: "merchant", title: "Buna Bet Coffee", phone: "+251 920 334 010", amount: -120, ts: at(1, 9, 14), status: "Completed", method: "QR Pay" },
    { id: "DEMO-839954", kind: "bill", title: "EEPCO Utility", amount: -430, ts: at(2, 13, 58), status: "Completed", method: "Wallet", refId: "electricity", note: "Meter 042-118-77" },
    { id: "DEMO-837431", kind: "received", title: "Meron Tadesse", phone: "+251 913 552 906", amount: 950, ts: at(3, 16, 30), status: "Completed", method: "Wallet" },
    { id: "DEMO-831208", kind: "bank", title: "Awash Bank", amount: -2000, ts: at(4, 10, 2), status: "Completed", method: "Wallet" },
    { id: "DEMO-829346", kind: "sent", title: "Dawit Haile", phone: "+251 920 118 340", amount: -300, ts: at(5, 20, 47), status: "Pending", method: "Wallet", note: "Dinner split" },
    { id: "DEMO-821550", kind: "received", title: "Acme Trading PLC", phone: "+251 911 600 002", amount: 18500, ts: at(6, 9, 0), status: "Completed", method: "Bank", note: "Invoice #1042" },
    { id: "DEMO-818873", kind: "bill", title: "WebSprix", amount: -999, ts: at(7, 8, 19), status: "Completed", method: "Wallet", refId: "internet" },
    { id: "DEMO-815504", kind: "received", title: "Tigist Alemu", phone: "+251 911 980 112", amount: 450, ts: at(8, 13, 25), status: "Completed", method: "Wallet" },
    { id: "DEMO-810092", kind: "bill", title: "Addis Water & Sewerage", amount: -260, ts: at(9, 12, 41), status: "Completed", method: "Wallet", refId: "water" },
  ];
}

export const CONTACTS: Contact[] = [
  { name: "Abebe Kebede", phone: "+251 911 204 482" },
  { name: "Hana Ali", phone: "+251 912 845 117" },
  { name: "Meron Tadesse", phone: "+251 913 552 906" },
  { name: "Dawit Haile", phone: "+251 920 118 340" },
  { name: "Selam Bekele", phone: "+251 911 673 255" },
  { name: "Yonas Girma", phone: "+251 913 044 821" },
  { name: "Tigist Alemu", phone: "+251 911 980 112" },
  { name: "Kalkidan Assefa", phone: "+251 920 555 768" },
];

export const AIRTIME_AMOUNTS = [50, 100, 200, 500, 1000];

export const BILL_CATS = [
  "electricity",
  "water",
  "internet",
  "tv",
  "telephone",
  "other",
] as const;

export const BANKS = [
  { code: "CBE", name: "Commercial Bank of Ethiopia", color: "#7C5CE0" },
  { code: "AWB", name: "Awash Bank", color: "#D98A00" },
  { code: "DSH", name: "Dashen Bank", color: "#2B7CD3" },
  { code: "BOA", name: "Bank of Abyssinia", color: "#0E9488" },
  { code: "ZMN", name: "Zemen Bank", color: "#C24E7E" },
  { code: "AMB", name: "Amhara Bank", color: "#B8541D" },
];

export interface Notif {
  id: string;
  tone: "brand" | "warn" | "info";
  ago: string;
  en: { title: string; body: string };
  am: { title: string; body: string };
}

export const NOTIFS: Notif[] = [
  {
    id: "n1",
    tone: "brand",
    ago: "2h",
    en: { title: "Money received", body: "Hana Ali sent you ETB 1,200.00" },
    am: { title: "ገንዘብ ደርሶዎታል", body: "ሃና አሊ ETB 1,200.00 ልካለች" },
  },
  {
    id: "n2",
    tone: "warn",
    ago: "1d",
    en: { title: "Security tip", body: "Never share your PIN — even with support." },
    am: { title: "የደህንነት ምክር", body: "ፒንዎን ከማንም ጋር አያጋሩ — ከድጋፍ ቡድን ጋር እንኳን።" },
  },
  {
    id: "n3",
    tone: "info",
    ago: "3d",
    en: { title: "Cashback weekend", body: "Earn 2% back on QR payments this weekend. Demo promo." },
    am: { title: "የካሽባክ ቅናሽ", body: "በዚህ ቅዳሜና እሁድ በQR ክፍያ 2% ይመልሱ። የማሳያ ማስታወቂያ።" },
  },
];
