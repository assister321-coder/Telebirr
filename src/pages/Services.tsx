import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  Droplets,
  FileText,
  MoreHorizontal,
  Phone,
  Tv,
  Wifi,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import Header from "../components/Header";
import { AmountInput, Field, PhoneInput, TextInput, validETPhone } from "../components/fields";
import { Btn, Card, cn } from "../components/primitives";
import { AIRTIME_AMOUNTS, BANKS, BILL_CATS } from "../data/mock";
import { useApp } from "../store/AppContext";

const BILL_META: Record<string, { icon: LucideIcon; fg: string; bg: string }> = {
  electricity: { icon: Zap, fg: "#C47F00", bg: "rgba(217,138,0,0.13)" },
  water: { icon: Droplets, fg: "#2B7CD3", bg: "rgba(43,124,211,0.12)" },
  internet: { icon: Wifi, fg: "#7C5CE0", bg: "rgba(124,92,224,0.12)" },
  tv: { icon: Tv, fg: "#C24E7E", bg: "rgba(194,78,126,0.12)" },
  telephone: { icon: Phone, fg: "#0E9488", bg: "rgba(14,148,136,0.12)" },
  other: { icon: MoreHorizontal, fg: "#69736D", bg: "rgba(105,115,109,0.12)" },
};

/* ─────────────────────────── Airtime ───────────────────────────── */
export function Airtime() {
  const { t, navigate, balance } = useApp();
  const [phone, setPhone] = useState("911223344");
  const [sel, setSel] = useState<number | "custom">(100);
  const [custom, setCustom] = useState("");
  const [err, setErr] = useState<string | null>(null);

  const amount = sel === "custom" ? parseFloat(custom) : sel;

  const submit = () => {
    if (!validETPhone(phone)) { setErr(t("err.phone")); return; }
    if (!amount || amount <= 0 || Number.isNaN(amount)) { setErr(t("err.amount")); return; }
    if (amount > balance) { setErr(t("err.balance")); return; }
    navigate("confirm", {
      flow: {
        type: "airtime",
        title: t("airtime.provider"),
        subtitle: `+251 ${phone.slice(0, 3)} ${phone.slice(3, 6)} ${phone.slice(6)}`,
        phone: `+251 ${phone.slice(0, 3)} ${phone.slice(3, 6)} ${phone.slice(6)}`,
        amount,
      },
    });
  };

  return (
    <div className="min-h-full flex flex-col bg-bg">
      <Header title={t("airtime.title")} />
      <div className="flex-1 px-4 lg:px-8 py-5 max-w-[560px] w-full mx-auto space-y-6">
        <Field label={`${t("airtime.phone")} · ${t("airtime.provider")}`}>
          <PhoneInput value={phone} onChange={setPhone} />
        </Field>

        <Field label={t("airtime.select")} error={sel === "custom" ? err : err && !validETPhone(phone) ? err : null}>
          <div className="grid grid-cols-3 gap-2.5">
            {AIRTIME_AMOUNTS.map((a) => (
              <motion.button
                key={a}
                whileTap={{ scale: 0.94 }}
                onClick={() => { setSel(a); setErr(null); }}
                className={cn(
                  "h-12 rounded-2xl border text-[14.5px] font-bold transition-colors",
                  sel === a
                    ? "bg-brand-500 border-transparent text-white shadow-[0_8px_18px_rgb(22_138_69/0.28)]"
                    : "bg-surface border-line text-ink hover:border-brand-300"
                )}
              >
                ETB {a.toLocaleString()}
              </motion.button>
            ))}
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={() => setSel("custom")}
              className={cn(
                "h-12 rounded-2xl border text-[14px] font-bold transition-colors",
                sel === "custom"
                  ? "bg-brand-500 border-transparent text-white shadow-[0_8px_18px_rgb(22_138_69/0.28)]"
                  : "bg-surface border-line text-ink hover:border-brand-300"
              )}
            >
              {t("airtime.custom")}
            </motion.button>
          </div>
        </Field>

        <AnimatePresence>
          {sel === "custom" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <Card className="px-4 pt-2 pb-4">
                <AmountInput value={custom} onChange={(v) => { setCustom(v); setErr(null); }} />
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
        {err && sel !== "custom" && validETPhone(phone) && <p className="text-[12.5px] text-danger font-medium px-1">{err}</p>}
      </div>
      <div className="px-4 lg:px-8 pb-6 max-w-[560px] w-full mx-auto">
        <Btn onClick={submit}>{t("common.continue")}</Btn>
      </div>
    </div>
  );
}

/* ─────────────────────────── Bills ─────────────────────────────── */
export function Bills() {
  const { t, navigate, balance, back } = useApp();
  const [cat, setCat] = useState<string | null>(null);
  const [cust, setCust] = useState("");
  const [amount, setAmount] = useState("");
  const [errC, setErrC] = useState(false);
  const [errA, setErrA] = useState<string | null>(null);

  const submit = () => {
    const amt = parseFloat(amount);
    const okC = cust.trim().length >= 4;
    const okA = !!amt && amt > 0;
    setErrC(!okC);
    setErrA(!okA ? t("err.amount") : amt > balance ? t("err.balance") : null);
    if (!okC || !okA || amt > balance) return;
    navigate("confirm", {
      flow: {
        type: "bill",
        title: t(`bill.${cat}`),
        subtitle: `${t("bills.customerId")} · ${cust}`,
        amount: amt,
        refId: cat!,
      },
    });
  };

  return (
    <div className="min-h-full flex flex-col bg-bg">
      <Header title={t("bills.title")} onBack={cat ? () => setCat(null) : back} />
      <div className="flex-1 px-4 lg:px-8 py-5 max-w-[560px] w-full mx-auto space-y-6">
        <Field label={t("bills.choose")}>
          <div className="grid grid-cols-3 gap-2.5">
            {BILL_CATS.map((c) => {
              const m = BILL_META[c];
              const Icon = m.icon;
              const active = cat === c;
              return (
                <motion.button
                  key={c}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCat(c)}
                  className={cn(
                    "flex flex-col items-center gap-2.5 py-4 rounded-2xl border bg-surface transition-colors relative",
                    active ? "border-brand-500 ring-2 ring-brand-500/15" : "border-line hover:border-brand-200"
                  )}
                >
                  {active && (
                    <span className="absolute top-2 right-2 w-[18px] h-[18px] rounded-full bg-brand-500 text-white flex items-center justify-center">
                      <Check size={11} strokeWidth={3.5} />
                    </span>
                  )}
                  <span
                    className="w-11 h-11 rounded-2xl flex items-center justify-center"
                    style={{ background: m.bg, color: m.fg }}
                  >
                    <Icon size={20} strokeWidth={2.1} />
                  </span>
                  <span className="text-[12px] font-semibold">{t(`bill.${c}`)}</span>
                </motion.button>
              );
            })}
          </div>
        </Field>

        <AnimatePresence>
          {cat && (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="space-y-5"
            >
              <Field label={t("bills.customerId")} error={errC ? t("err.field") : null}>
                <TextInput
                  icon={FileText}
                  value={cust}
                  onChange={(v) => { setCust(v); setErrC(false); }}
                  placeholder="e.g. 042-118-77"
                  autoFocus
                />
              </Field>
              <Field label={t("bills.amount")} error={errA}>
                <Card className="px-4 pt-2 pb-4">
                  <AmountInput value={amount} onChange={(v) => { setAmount(v); setErrA(null); }} />
                </Card>
              </Field>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {cat && (
        <div className="px-4 lg:px-8 pb-6 max-w-[560px] w-full mx-auto">
          <Btn onClick={submit}>{t("common.continue")}</Btn>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────── Bank transfer ─────────────────────── */
export function Bank() {
  const { t, navigate, balance } = useApp();
  const [bank, setBank] = useState(BANKS[0].code);
  const [acct, setAcct] = useState("");
  const [amount, setAmount] = useState("");
  const [errAcct, setErrAcct] = useState(false);
  const [errA, setErrA] = useState<string | null>(null);

  const submit = () => {
    const amt = parseFloat(amount);
    const okA = /^\d{6,16}$/.test(acct.replace(/\s/g, ""));
    setErrAcct(!okA);
    const okAmt = !!amt && amt > 0 && amt <= balance;
    setErrA(!amt || amt <= 0 ? t("err.amount") : amt > balance ? t("err.balance") : null);
    if (!okA || !okAmt) return;
    const b = BANKS.find((x) => x.code === bank)!;
    navigate("confirm", {
      flow: {
        type: "bank",
        title: b.name,
        subtitle: `${t("bank.account")} · ${acct}`,
        amount: amt,
      },
    });
  };

  return (
    <div className="min-h-full flex flex-col bg-bg">
      <Header title={t("bank.title")} />
      <div className="flex-1 px-4 lg:px-8 py-5 max-w-[560px] w-full mx-auto space-y-6">
        <Field label={t("bank.select")}>
          <Card className="divide-y divide-line/70 py-1">
            {BANKS.map((b) => {
              const active = bank === b.code;
              return (
                <button
                  key={b.code}
                  onClick={() => setBank(b.code)}
                  className="w-full flex items-center gap-3.5 px-4 py-3 text-left"
                >
                  <span
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-[11px] font-extrabold tracking-wide shrink-0"
                    style={{ background: `${b.color}16`, color: b.color }}
                  >
                    {b.code}
                  </span>
                  <span className="flex-1 text-[14px] font-semibold">{b.name}</span>
                  <span
                    className={cn(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                      active ? "border-brand-500" : "border-line"
                    )}
                  >
                    {active && <span className="w-2.5 h-2.5 rounded-full bg-brand-500" />}
                  </span>
                </button>
              );
            })}
          </Card>
        </Field>

        <Field label={t("bank.account")} error={errAcct ? t("err.field") : null}>
          <TextInput
            value={acct}
            onChange={(v) => { setAcct(v); setErrAcct(false); }}
            placeholder="1000123456789"
            inputMode="numeric"
          />
        </Field>

        <Field label={t("bank.amount")} error={errA}>
          <Card className="px-4 pt-2 pb-4">
            <AmountInput value={amount} onChange={(v) => { setAmount(v); setErrA(null); }} />
          </Card>
        </Field>
      </div>
      <div className="px-4 lg:px-8 pb-6 max-w-[560px] w-full mx-auto">
        <Btn onClick={submit}>{t("common.continue")}</Btn>
      </div>
    </div>
  );
}
