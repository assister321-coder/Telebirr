import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import { Btn, Card } from "../components/primitives";
import { TxIcon } from "../components/TxRow";
import type { TxKind } from "../data/mock";
import { feeBand, serviceFee } from "../lib/fees";
import { fmtETB } from "../lib/format";
import { useApp, type FlowPayload } from "../store/AppContext";

/** kinds that deduct money (and therefore attract the tiered fee) */
const OUT: TxKind[] = ["sent", "bill", "airtime", "bank", "merchant"];

/* ─────────────────────────── Confirm ───────────────────────────── */
export function ConfirmScreen() {
  const { t, back, commitTx, navigate, balance, toast, route } = useApp();
  const flow = route.params?.flow as FlowPayload | undefined;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!flow && route.name === "confirm") back();
  }, [flow, back, route.name]);

  if (!flow) return null;

  const fee = OUT.includes(flow.type) ? serviceFee(flow.amount) : 0;
  const total = Math.abs(flow.amount) + fee;

  const confirm = () => {
    if (total > balance) {
      toast(t("err.balance"), false);
      return;
    }
    setLoading(true);
    window.setTimeout(() => {
      const tx = commitTx(flow);
      navigate("success", { flow, tx });
    }, 1000);
  };

  return (
    <div className="min-h-full flex flex-col bg-bg">
      <Header title={t("confirm.title")} />
      <div className="flex-1 px-4 lg:px-8 py-5 max-w-[560px] w-full mx-auto space-y-5">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <Card className="overflow-hidden">
            {/* recipient hero */}
            <div className="flex flex-col items-center pt-7 pb-5 px-5 bg-gradient-to-b from-soft to-surface">
              <TxIcon kind={flow.type} title={flow.title} size={60} />
              <p className="mt-3 text-[16px] font-bold">{flow.title}</p>
              {(flow.phone || flow.subtitle) && (
                <p className="text-[12.5px] text-sub mt-0.5">{flow.phone ?? flow.subtitle}</p>
              )}
            </div>

            <div className="px-5 py-5 space-y-3">
              <div className="flex justify-between text-[14px]">
                <span className="text-sub">{t("confirm.amount")}</span>
                <span className="font-semibold tabular-nums">{fmtETB(flow.amount)}</span>
              </div>
              <div className="flex justify-between text-[14px]">
                <span className="text-sub flex items-center gap-1.5">
                  {t("confirm.fee")}
                  {fee > 0 && (
                    <span className="text-[10px] font-bold bg-warn/15 text-warn px-1.5 py-[1px] rounded-full tabular-nums">
                      {feeBand(flow.amount)}
                    </span>
                  )}
                </span>
                <span
                  className={`font-medium tabular-nums ${fee > 0 ? "text-warn" : "text-brand-600"}`}
                >
                  {fee > 0 ? `+ ${fmtETB(fee)}` : `${fmtETB(0)} · ${t("common.free")}`}
                </span>
              </div>
              {flow.note && (
                <div className="flex justify-between gap-6 text-[14px]">
                  <span className="text-sub shrink-0">{t("confirm.note")}</span>
                  <span className="font-medium text-right truncate">{flow.note}</span>
                </div>
              )}
              <div className="dashed-sep my-4" />
              <div className="flex justify-between items-baseline">
                <span className="text-[15px] font-semibold">{t("confirm.total")}</span>
                <span className="text-[22px] font-extrabold tracking-tight tabular-nums">
                  {fmtETB(total)}
                </span>
              </div>
            </div>
          </Card>
        </motion.div>

        <div className="flex items-center gap-2.5 bg-soft border border-brand-100 rounded-2xl px-3.5 py-3">
          <ShieldCheck size={16} className="text-brand-600 shrink-0" />
          <p className="text-[12px] font-medium text-brand-800 dark:text-brand-100/90">{t("confirm.demo")}</p>
        </div>
      </div>

      <div className="px-4 lg:px-8 pb-6 max-w-[560px] w-full mx-auto flex gap-3">
        <Btn variant="secondary" onClick={back} className="flex-1">{t("common.cancel")}</Btn>
        <Btn loading={loading} onClick={confirm} className="flex-[1.4]">{t("common.confirm")}</Btn>
      </div>
    </div>
  );
}

