import { AnimatePresence, motion } from "framer-motion";
import { Check, Loader2, X } from "lucide-react";
import { serviceFee, totalWithFee } from "../lib/fees";
import { fmtNum } from "../lib/format";
import { useApp } from "../store/AppContext";

/** Small wallet glyph used for the "Balance" payment method row. */
function WalletGlyph() {
  return (
    <svg width="34" height="28" viewBox="0 0 34 28" fill="none">
      <rect x="1.5" y="6" width="27" height="20" rx="3.5" fill="#8CC63F" />
      <path d="M6 6V4.2A2.7 2.7 0 0 1 8.7 1.5h11.6A2.7 2.7 0 0 1 23 4.2V6" stroke="#F5A623" strokeWidth="2.6" strokeLinecap="round" />
      <rect x="19" y="12.5" width="14" height="7.5" rx="3.2" fill="#6FA82F" />
      <circle cx="25.5" cy="16.2" r="1.9" fill="#F5F8F2" />
    </svg>
  );
}

export default function ConfirmSheet({
  open,
  onClose,
  onSend,
  name,
  amount,
  sending,
}: {
  open: boolean;
  onClose: () => void;
  onSend: () => void;
  name: string;
  amount: number;
  sending?: boolean;
}) {
  const { t, balance } = useApp();
  const fee = serviceFee(amount);
  const total = totalWithFee(amount);
  const enough = total <= balance;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[85] flex flex-col justify-end"
        >
          {/* dimmed backdrop over the amount screen */}
          <div className="absolute inset-0 bg-black/45" onClick={sending ? undefined : onClose} />

          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 340, damping: 34 }}
            className="relative bg-[#F1F3F1] dark:bg-[#111a14] rounded-t-[20px] w-full max-w-[560px] mx-auto max-h-[92svh] overflow-y-auto no-scrollbar pb-[max(env(safe-area-inset-bottom),16px)]"
          >
            {/* close */}
            <div className="px-5 pt-4">
              <button
                onClick={onClose}
                disabled={sending}
                className="w-9 h-9 -ml-1.5 flex items-center justify-center text-ink disabled:opacity-40"
                aria-label={t("common.cancel")}
              >
                <X size={23} strokeWidth={2.2} />
              </button>
            </div>

            {/* headline + total */}
            <div className="px-5 pt-1 pb-5 text-center">
              <p className="text-[15px] text-ink">
                {t("sheet.sendTo")} {name}
              </p>
              <p className="mt-1.5 font-extrabold tracking-tight text-ink">
                <span className="text-[38px] leading-none tabular-nums">{fmtNum(total)}</span>
                <span className="text-[17px] align-baseline">ETB</span>
              </p>
            </div>

            {/* amount breakdown */}
            <div className="mx-4 bg-surface rounded-[14px] px-4 divide-y divide-line/60">
              <div className="flex items-center justify-between py-4">
                <span className="text-[14.5px] text-sub">{t("sheet.originalAmount")}</span>
                <span className="text-[14.5px] font-semibold tabular-nums">
                  {fmtNum(amount)}
                  <span className="text-[12.5px]">ETB</span>
                </span>
              </div>
              <div className="flex items-center justify-between py-4">
                <span className="text-[14.5px] text-sub">{t("sheet.serviceFee")}</span>
                <span className="text-[14.5px] font-semibold tabular-nums">
                  {fmtNum(fee)}
                  <span className="text-[12.5px]">ETB</span>
                </span>
              </div>
            </div>

            {/* payment method */}
            <div className="mx-4 mt-3 bg-surface rounded-[14px] px-4 pt-3.5 pb-4">
              <p className="text-[14.5px] text-sub">{t("sheet.paymentMethod")}</p>
              <div className="flex items-center gap-3 mt-3">
                <WalletGlyph />
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] text-ink leading-tight">{t("sheet.balance")}</p>
                  <p className="text-[12.5px] text-sub mt-0.5">
                    ({t("sheet.available")}:{fmtNum(balance)}ETB)
                  </p>
                </div>
                <span className="w-6 h-6 rounded-full bg-[#8CC63F] flex items-center justify-center shrink-0">
                  <Check size={14} strokeWidth={3.5} className="text-white" />
                </span>
              </div>
            </div>

            {!enough && (
              <p className="mx-4 mt-3 text-[12.5px] font-medium text-danger text-center">
                {t("err.balance")}
              </p>
            )}

            {/* send */}
            <div className="px-5 pt-6">
              <motion.button
                whileTap={{ scale: enough && !sending ? 0.98 : 1 }}
                disabled={!enough || sending}
                onClick={onSend}
                className={`w-full h-[52px] rounded-[10px] text-[16px] font-semibold text-white flex items-center justify-center gap-2 transition-colors ${
                  enough && !sending ? "bg-[#8CC63F] active:bg-[#7ab234]" : "bg-[#D8E8C4]"
                }`}
              >
                {sending ? <Loader2 size={20} className="animate-spin" /> : t("sheet.send")}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
