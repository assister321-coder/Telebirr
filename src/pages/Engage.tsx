import { motion } from "framer-motion";
import { Flame, MessageSquareText, Plus, Star, Target, Trophy, Users, WalletCards } from "lucide-react";
import { useState } from "react";
import Header from "../components/Header";
import { Btn, Card, ListRow, Modal } from "../components/primitives";
import { useApp } from "../store/AppContext";

const MISSIONS = [
  { key: "mission1", pct: 66 },
  { key: "mission2", pct: 100 },
  { key: "mission3", pct: 20 },
];

export default function Engage() {
  const { t, toast, addMoney, balance } = useApp();
  const [amount, setAmount] = useState("");
  const [addOpen, setAddOpen] = useState(false);

  const submitAddMoney = () => {
    const value = Number(amount);
    if (!addMoney(value)) {
      toast("Enter a valid amount", false);
      return;
    }
    setAmount("");
    setAddOpen(false);
    toast(`ETB ${value.toLocaleString("en-US", { minimumFractionDigits: 2 })} added`);
  };

  return (
    <div className="min-h-full bg-bg">
      <Header title={t("engage.title")} plain />
      <div className="px-4 lg:px-8 py-5 max-w-[640px] mx-auto space-y-6">
        <p className="text-[13px] text-sub px-1 -mt-2">{t("engage.sub")}</p>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-soft text-brand-500">
              <WalletCards size={22} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-bold">Add money</p>
              <p className="mt-0.5 text-[12px] text-sub">Current balance: ETB {balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
            </div>
            <button
              onClick={() => setAddOpen(true)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-500 text-white shadow-[0_6px_14px_rgb(22_138_69/0.22)]"
              aria-label="Add money"
            >
              <Plus size={21} />
            </button>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {[100, 500, 1000].map((value) => (
              <button
                key={value}
                onClick={() => { addMoney(value); toast(`ETB ${value.toLocaleString()} added`); }}
                className="rounded-xl border border-line bg-bg py-2 text-[12px] font-semibold text-brand-600 hover:bg-soft"
              >
                + ETB {value.toLocaleString()}
              </button>
            ))}
          </div>
        </Card>

        {/* points hero */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="rounded-[22px] p-5 text-white bg-gradient-to-br from-brand-400 via-brand-500 to-brand-700 shadow-card flex items-center justify-between">
            <div>
              <p className="text-[12px] text-white/75 font-medium">{t("engage.points")}</p>
              <p className="text-[30px] font-extrabold tracking-tight mt-1">2,480</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-white/15 flex items-center justify-center">
                <Flame size={24} />
              </div>
              <p className="text-[11px] font-semibold mt-1.5">7 {t("engage.streak")}</p>
            </div>
          </div>
        </motion.div>

        {/* missions */}
        <div>
          <p className="text-[13px] font-semibold text-sub mb-2 px-1 flex items-center gap-1.5">
            <Target size={14} /> {t("engage.missionsTitle")}
          </p>
          <Card className="divide-y divide-line/70 py-2 px-4">
            {MISSIONS.map((m) => (
              <div key={m.key} className="py-3">
                <div className="flex items-center justify-between">
                  <p className="text-[13.5px] font-medium pr-4">{t(`engage.${m.key}`)}</p>
                  {m.pct === 100 ? (
                    <Trophy size={16} className="text-warn shrink-0" />
                  ) : (
                    <span className="text-[12px] font-bold text-brand-500 shrink-0">{m.pct}%</span>
                  )}
                </div>
                <div className="mt-2 h-1.5 rounded-full bg-soft overflow-hidden">
                  <div
                    className={`h-full rounded-full ${m.pct === 100 ? "bg-warn" : "bg-brand-500"}`}
                    style={{ width: `${m.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </Card>
        </div>

        {/* community */}
        <div>
          <p className="text-[13px] font-semibold text-sub mb-2 px-1 flex items-center gap-1.5">
            <Users size={14} /> {t("engage.communityTitle")}
          </p>
          <Card className="divide-y divide-line/70 py-1">
            <ListRow icon={MessageSquareText} tint="#2B7CD3" title={t("engage.community1")} onClick={() => toast(t("demo.feature"), false)} />
            <ListRow icon={Star} tint="#D98A00" title={t("engage.community2")} onClick={() => toast(t("demo.feature"), false)} />
          </Card>
        </div>
      </div>

      <Modal open={addOpen} onClose={() => setAddOpen(false)}>
        <h3 className="text-[18px] font-bold">Add money</h3>
        <p className="mt-1 text-[13px] text-sub">Choose an amount to add to your wallet.</p>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {[100, 500, 1000].map((value) => (
            <button
              key={value}
              onClick={() => setAmount(String(value))}
              className={`rounded-xl border py-2 text-[12px] font-semibold ${amount === String(value) ? "border-brand-500 bg-soft text-brand-600" : "border-line text-sub"}`}
            >
              ETB {value.toLocaleString()}
            </button>
          ))}
        </div>
        <input
          autoFocus
          value={amount}
          onChange={(event) => setAmount(event.target.value.replace(/[^0-9]/g, "").slice(0, 8))}
          inputMode="numeric"
          placeholder="Custom amount"
          className="mt-3 h-12 w-full rounded-xl border border-line bg-surface px-4 text-[16px] outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-500/10"
        />
        <div className="mt-4 flex gap-2">
          <Btn variant="secondary" onClick={() => setAddOpen(false)} className="flex-1">Cancel</Btn>
          <Btn onClick={submitAddMoney} className="flex-1">Add money</Btn>
        </div>
      </Modal>
    </div>
  );
}
