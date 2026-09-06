import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { DICT, type Lang } from "../data/i18n";
import { buildInitialTxs, type Tx, type TxKind } from "../data/mock";
import { serviceFee } from "../lib/fees";

export type Theme = "light" | "dark";
export type NavDir = "push" | "pop" | "tab";

export type RouteName =
  | "splash"
  | "login"
  | "home"
  | "payments"
  | "send"
  | "sendAmount"
  | "confirm"
  | "success"
  | "receive"
  | "scan"
  | "airtime"
  | "bills"
  | "bank"
  | "transactions"
  | "txdetail"
  | "profile"
  | "settings"
  | "apps"
  | "engage";

export interface Route {
  name: RouteName;
  params?: any;
}

/** Payload that drives the confirm → success payment flow */
export interface FlowPayload {
  type: TxKind;
  title: string;
  subtitle?: string;
  phone?: string;
  amount: number;
  note?: string;
  refId?: string;
  method?: string;
}

interface ToastMsg {
  id: number;
  msg: string;
  ok: boolean;
}

interface AppCtx {
  route: Route;
  dir: NavDir;
  seq: number;
  navigate: (name: RouteName, params?: any) => void;
  back: () => void;
  resetTo: (name: RouteName, params?: any) => void;

  balance: number;
  addMoney: (amount: number) => boolean;
  balanceHidden: boolean;
  toggleHidden: () => void;
  txs: Tx[];
  commitTx: (flow: FlowPayload) => Tx;

  user: { name: string; phone: string; tail: string };
  login: (phone: string) => void;

  lang: Lang;
  setLang: (l: Lang) => void;
  t: (k: string) => string;
  txSub: (tx: Tx) => string;

  theme: Theme;
  setTheme: (th: Theme) => void;
  notifOn: boolean;
  setNotifOn: (v: boolean) => void;

  toasts: ToastMsg[];
  toast: (msg: string, ok?: boolean) => void;

  greeting: () => string;
}

const Ctx = createContext<AppCtx | null>(null);

const OUTGOING: TxKind[] = ["sent", "bill", "airtime", "bank", "merchant"];

export function AppProvider({ children }: { children: ReactNode }) {
  const [stack, setStack] = useState<Route[]>([{ name: "splash" }]);
  const [dir, setDir] = useState<NavDir>("tab");
  const [seq, setSeq] = useState(0);

  const [balance, setBalance] = useState(794);
  const [balanceHidden, setBalanceHidden] = useState(false);
  const [txs, setTxs] = useState<Tx[]>(() => buildInitialTxs());

  const [userPhone, setUserPhone] = useState("+251 911 223 344");
  const [lang, setLang] = useState<Lang>("en");
  const [theme, setTheme] = useState<Theme>("light");
  const [notifOn, setNotifOn] = useState(true);
  const [toasts, setToasts] = useState<ToastMsg[]>([]);
  const toastId = useRef(0);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    document.documentElement.dataset.lang = lang;
  }, [lang]);

  const navigate = useCallback((name: RouteName, params?: any) => {
    setDir("push");
    setSeq((s) => s + 1);
    setStack((s) => [...s, { name, params }]);
  }, []);

  const back = useCallback(() => {
    setDir("pop");
    setSeq((s) => s + 1);
    setStack((s) => (s.length > 1 ? s.slice(0, -1) : s));
  }, []);

  const resetTo = useCallback((name: RouteName, params?: any) => {
    setDir("tab");
    setSeq((s) => s + 1);
    setStack([{ name, params }]);
  }, []);

  const t = useCallback(
    (k: string) => DICT[lang][k] ?? DICT.en[k] ?? k,
    [lang]
  );

  const txSub = useCallback(
    (tx: Tx) => {
      if (tx.kind === "bill" && tx.refId) {
        return `${t(`bill.${tx.refId}`)} · ${t("sub.bill")}`;
      }
      return t(`sub.${tx.kind}`);
    },
    [t]
  );

  const toast = useCallback((msg: string, ok = true) => {
    const id = ++toastId.current;
    setToasts((ts) => [...ts.slice(-2), { id, msg, ok }]);
    window.setTimeout(() => {
      setToasts((ts) => ts.filter((x) => x.id !== id));
    }, 2400);
  }, []);

  const addMoney = useCallback((amount: number) => {
    if (!Number.isFinite(amount) || amount <= 0) return false;
    setBalance((current) => current + amount);
    return true;
  }, []);

  const login = useCallback(
    (phone: string) => {
      setUserPhone(phone);
      resetTo("home");
      window.setTimeout(() => toast(DICT[lang]["login.toast"]), 450);
    },
    [resetTo, toast, lang]
  );

  const commitTx = useCallback(
    (flow: FlowPayload): Tx => {
      const neg = OUTGOING.includes(flow.type);
      const now = new Date();
      const fee = neg ? serviceFee(flow.amount) : 0;

      /* Device-style receipt reference: 10 uppercase alphanumerics, e.g. DI33ESZ0HJ.
         Seeded from the real transaction moment so every receipt is unique. */
      const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let id = "";
      for (let i = 0; i < 10; i++) {
        id += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
      }

      const tx: Tx = {
        id,
        kind: flow.type,
        title: flow.title,
        phone: flow.phone,
        amount: neg ? -Math.abs(flow.amount) : Math.abs(flow.amount),
        fee,
        ts: now.getTime(),
        status: "Completed",
        method: flow.method ?? (flow.type === "merchant" ? "QR Pay" : "Wallet"),
        refId: flow.refId,
        note: flow.note,
      };
      setTxs((xs) => [tx, ...xs]);
      // amount is already signed; the fee is always an extra deduction
      setBalance((b) => b + tx.amount - fee);
      return tx;
    },
    []
  );

  const greeting = useCallback(() => {
    const h = new Date().getHours();
    if (h < 12) return t("greet.morning");
    if (h < 18) return t("greet.afternoon");
    return t("greet.evening");
  }, [t]);

  const value = useMemo<AppCtx>(
    () => ({
      route: stack[stack.length - 1],
      dir,
      seq,
      navigate,
      back,
      resetTo,
      balance,
      addMoney,
      balanceHidden,
      toggleHidden: () => setBalanceHidden((v) => !v),
      txs,
      commitTx,
      user: { name: "Nebiyou Demo", phone: userPhone, tail: "4821" },
      login,
      lang,
      setLang,
      t,
      txSub,
      theme,
      setTheme,
      notifOn,
      setNotifOn,
      toasts,
      toast,
      greeting,
    }),
    [
      stack, dir, seq, navigate, back, resetTo, balance, balanceHidden, txs,
      commitTx, addMoney, userPhone, login, lang, t, txSub, theme, notifOn, toasts, toast, greeting,
    ]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useApp outside provider");
  return v;
}
