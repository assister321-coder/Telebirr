import { AnimatePresence, motion } from "framer-motion";
import { Download, Share2, X } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";
import PromoCarousel from "../components/PromoCarousel";
import StatusBar from "../components/StatusBar";
import type { Tx } from "../data/mock";
import { fmtNum, fmtReceiptStamp } from "../lib/format";
import { useApp } from "../store/AppContext";

/** Small green QR glyph used for the "QR Code" toggle. */
function QrGlyph() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="2" width="8" height="8" rx="1.6" stroke="#8CC63F" strokeWidth="2.2" />
      <rect x="14" y="2" width="8" height="8" rx="1.6" stroke="#8CC63F" strokeWidth="2.2" />
      <rect x="2" y="14" width="8" height="8" rx="1.6" stroke="#8CC63F" strokeWidth="2.2" />
      <rect x="14.5" y="14.5" width="3" height="3" fill="#8CC63F" />
      <rect x="19" y="14.5" width="3" height="3" fill="#8CC63F" />
      <rect x="14.5" y="19" width="3" height="3" fill="#8CC63F" />
      <rect x="19" y="19" width="3" height="3" fill="#8CC63F" />
    </svg>
  );
}

const TYPE_KEY: Record<string, string> = {
  sent: "rcpt.typeTransfer",
  received: "rcpt.typeReceive",
  airtime: "rcpt.typeAirtime",
  bill: "rcpt.typeBill",
  bank: "rcpt.typeBank",
  merchant: "rcpt.typeMerchant",
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-6 py-[13px]">
      <span className="text-[14px] text-[#9aa39d] shrink-0">{label}</span>
      <span className="text-[14px] text-ink text-right font-medium">{value}</span>
    </div>
  );
}

export default function Success() {
  const { t, route, resetTo, toast } = useApp();
  const tx = route.params?.tx as Tx | undefined;
  const [qrOpen, setQrOpen] = useState(false);

  useEffect(() => {
    if (!tx && route.name === "success") resetTo("home");
  }, [tx, resetTo, route.name]);

  if (!tx) return null;

  /* total actually deducted = amount + tiered fee */
  const total = Math.abs(tx.amount) + (tx.fee ?? 0);
  const signed = tx.amount < 0 ? `-${fmtNum(total)}` : `+${fmtNum(total)}`;

  const receiptText = [
    `telebirr receipt`,
    `${t("rcpt.time").replace(":", "")}: ${fmtReceiptStamp(tx.ts)}`,
    `${t("rcpt.type").replace(":", "")}: ${t(TYPE_KEY[tx.kind] ?? "rcpt.typeTransfer")}`,
    `${t("rcpt.to").replace(":", "")}: ${tx.title}`,
    `${t("rcpt.number").replace(":", "")}: ${tx.id}`,
    `Amount: ${signed} ETB`,
  ].join("\n");

  const copy = async (msg: string) => {
    try {
      await navigator.clipboard.writeText(receiptText);
    } catch {
      /* clipboard unavailable in this context */
    }
    toast(msg);
  };

  return (
    <div className="min-h-full flex flex-col bg-surface">
      <StatusBar />

      {/* Download / Share actions */}
      <div className="flex items-center justify-between px-5 pt-5 pb-2">
        <button
          onClick={() => copy(t("rcpt.saved"))}
          className="flex items-center gap-2 text-[#8CC63F] active:opacity-70 transition-opacity"
        >
          <Download size={19} strokeWidth={2.2} />
          <span className="text-[15.5px] font-medium">{t("rcpt.download")}</span>
        </button>
        <button
          onClick={() => copy(t("common.copied"))}
          className="flex items-center gap-2 text-[#8CC63F] active:opacity-70 transition-opacity"
        >
          <Share2 size={19} strokeWidth={2.2} />
          <span className="text-[15.5px] font-medium">{t("rcpt.share")}</span>
        </button>
      </div>

      <div className="flex-1 max-w-[560px] w-full mx-auto px-5 flex flex-col">
        {/* success badge */}
        <div className="flex flex-col items-center pt-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 17 }}
            className="w-[74px] h-[74px] rounded-full bg-[#8CC63F] flex items-center justify-center"
          >
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <motion.path
                d="M11 20.5l6 6 12-13"
                stroke="white"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.4, delay: 0.25 }}
              />
            </svg>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mt-3.5 text-[17px] font-medium text-[#8CC63F]"
          >
            {t("rcpt.successful")}
          </motion.p>
        </div>

        {/* amount */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="flex items-baseline justify-center pt-14 pb-12"
        >
          <span className="text-[42px] font-normal tracking-tight text-ink tabular-nums leading-none">
            {signed}
          </span>
          <span className="text-[16px] text-sub ml-2">(ETB)</span>
        </motion.div>

        {/* details */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="border-t border-line pt-1"
        >
          <Row label={t("rcpt.time")} value={fmtReceiptStamp(tx.ts)} />
          <Row label={t("rcpt.type")} value={t(TYPE_KEY[tx.kind] ?? "rcpt.typeTransfer")} />
          <Row label={t("rcpt.to")} value={tx.title} />
          <Row label={t("rcpt.number")} value={tx.id} />

          <div className="flex justify-end pt-1 pb-3">
            <button
              onClick={() => setQrOpen(true)}
              className="flex items-center gap-2 active:opacity-70 transition-opacity"
            >
              <QrGlyph />
              <span className="text-[15px] font-semibold text-[#8CC63F]">{t("rcpt.qr")}</span>
            </button>
          </div>
        </motion.div>

        {/* promo */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="pb-4"
        >
          <PromoCarousel dotsBelow />
        </motion.div>

        <div className="flex-1 min-h-4" />

        {/* finished */}
        <div className="pb-7 pt-2">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => resetTo("home")}
            className="w-[80%] max-w-[300px] mx-auto block h-[52px] rounded-[26px] bg-[#8CC63F] active:bg-[#7ab234] text-white text-[16.5px] font-medium transition-colors"
          >
            {t("rcpt.finished")}
          </motion.button>
        </div>
      </div>

      {/* QR modal */}
      <AnimatePresence>
        {qrOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[85] flex items-center justify-center p-6"
          >
            <div className="absolute inset-0 bg-black/50" onClick={() => setQrOpen(false)} />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
              className="relative bg-white rounded-2xl p-6 flex flex-col items-center"
            >
              <button
                onClick={() => setQrOpen(false)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-[#69736d] hover:bg-black/5"
                aria-label="Close"
              >
                <X size={18} />
              </button>
              <QRCodeSVG value={receiptText} size={196} fgColor="#1c3d13" bgColor="#FFFFFF" level="M" />
              <p className="mt-4 text-[13px] font-mono font-semibold tracking-wide text-[#17201b]">
                {tx.id}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
