import { motion } from "framer-motion";
import { Check, Clock3, Share2 } from "lucide-react";
import { useEffect } from "react";
import Header from "../components/Header";
import { Btn, Card } from "../components/primitives";
import { TxIcon } from "../components/TxRow";
import type { Tx } from "../data/mock";
import { fmtDate, fmtETB, fmtSigned, fmtTime } from "../lib/format";
import { useApp } from "../store/AppContext";

function Row({ k, v, mono }: { k: string; v: string; mono?: boolean }) {
  return (
    <div className="flex justify-between gap-6 py-[11px]">
      <span className="text-[13px] text-sub shrink-0">{k}</span>
      <span className={`text-[13.5px] font-semibold text-right ${mono ? "font-mono tracking-wide" : ""}`}>
        {v}
      </span>
    </div>
  );
}

export default function TxDetail() {
  const { t, route, back, toast, txSub } = useApp();
  const tx = route.params?.tx as Tx | undefined;

  useEffect(() => {
    if (!tx && route.name === "txdetail") back();
  }, [tx, back, route.name]);

  if (!tx) return null;
  const pos = tx.amount > 0;
  const ok = tx.status === "Completed";

  const share = async () => {
    try {
      await navigator.clipboard.writeText(
        [
          `telebirr receipt`,
          `Ref: ${tx.id}`,
          `${tx.title}${tx.phone ? ` (${tx.phone})` : ""}`,
          `Amount: ${fmtSigned(tx.amount)}`,
          ...(tx.fee
            ? [`Service fee: ${fmtETB(tx.fee)}`, `Total: ${fmtETB(Math.abs(tx.amount) + tx.fee)}`]
            : []),
          `${fmtDate(tx.ts)} at ${fmtTime(tx.ts)}`,
        ].join("\n")
      );
    } catch { /* noop */ }
    toast(t("common.copied"));
  };

  return (
    <div className="min-h-full flex flex-col bg-bg">
      <Header title={t("det.title")} />
      <div className="flex-1 px-4 lg:px-8 py-6 max-w-[560px] w-full mx-auto">
        {/* hero */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center text-center"
        >
          <div className="relative">
            <TxIcon kind={tx.kind} title={tx.title} size={68} />
            <span
              className={`absolute -bottom-1 -right-1 w-7 h-7 rounded-full border-[3px] border-bg flex items-center justify-center ${
                ok ? "bg-brand-500" : "bg-warn"
              }`}
            >
              {ok ? <Check size={13} strokeWidth={3.5} className="text-white" /> : <Clock3 size={13} className="text-white" />}
            </span>
          </div>
          <p className={`mt-3 text-[13px] font-semibold ${ok ? "text-brand-500" : "text-warn"}`}>
            {ok ? t("status.completed") : t("status.pending")}
          </p>
          <p
            className={`mt-1.5 text-[34px] font-extrabold tracking-tight tabular-nums leading-none ${
              pos ? "text-brand-500" : "text-ink"
            }`}
          >
            {fmtSigned(tx.amount)}
          </p>
          <p className="mt-2 text-[15px] font-semibold">{tx.title}</p>
          <p className="text-[12.5px] text-sub mt-0.5">{txSub(tx)}</p>
        </motion.div>

        {/* details */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="mt-7"
        >
          <Card className="px-5 py-2.5 divide-y divide-line/70">
            <Row k={t("det.recipient")} v={tx.title} />
            {tx.phone && <Row k={t("det.phone")} v={tx.phone} />}
            {!!tx.fee && (
              <>
                <Row k={t("fee.amountSent")} v={fmtETB(tx.amount)} />
                <Row k={t("fee.label")} v={`+ ${fmtETB(tx.fee)}`} />
                <Row k={t("fee.total")} v={fmtETB(Math.abs(tx.amount) + tx.fee)} />
              </>
            )}
            <Row k={t("det.date")} v={fmtDate(tx.ts)} />
            <Row k={t("det.time")} v={fmtTime(tx.ts)} />
            <Row k={t("det.id")} v={tx.id} mono />
            <Row k={t("det.method")} v={tx.method} />
            {tx.note && <Row k={t("det.note")} v={tx.note} />}
          </Card>
        </motion.div>
      </div>

      <div className="px-4 lg:px-8 pb-6 max-w-[560px] w-full mx-auto">
        <Btn variant="secondary" icon={Share2} onClick={share}>
          {t("det.share")}
        </Btn>
      </div>
    </div>
  );
}
