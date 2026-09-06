import {
  ArrowDownLeft,
  ArrowUpRight,
  Landmark,
  QrCode,
  ReceiptText,
  Smartphone,
  type LucideIcon,
} from "lucide-react";
import { Avatar, StatusBadge } from "./primitives";
import { fmtSigned } from "../lib/format";
import type { Tx, TxKind } from "../data/mock";
import { useApp } from "../store/AppContext";

export const TX_STYLE: Record<TxKind, { icon: LucideIcon; bg: string; fg: string }> = {
  sent: { icon: ArrowUpRight, bg: "rgba(217,84,84,0.10)", fg: "#D95454" },
  received: { icon: ArrowDownLeft, bg: "rgba(22,138,69,0.11)", fg: "#168A45" },
  airtime: { icon: Smartphone, bg: "rgba(124,92,224,0.11)", fg: "#7C5CE0" },
  bank: { icon: Landmark, bg: "rgba(43,124,211,0.11)", fg: "#2B7CD3" },
  bill: { icon: ReceiptText, bg: "rgba(217,138,0,0.12)", fg: "#C47F00" },
  merchant: { icon: QrCode, bg: "rgba(14,148,136,0.12)", fg: "#0E9488" },
};

export function TxIcon({ kind, title, size = 44 }: { kind: TxKind; title: string; size?: number }) {
  const s = TX_STYLE[kind];
  const Icon = s.icon;
  if (kind === "sent" || kind === "received") {
    return <Avatar name={title} size={size} />;
  }
  return (
    <div
      style={{ width: size, height: size, background: s.bg, color: s.fg }}
      className="rounded-full flex items-center justify-center shrink-0"
    >
      <Icon size={size * 0.46} strokeWidth={2.1} />
    </div>
  );
}

export default function TxRow({ tx, onClick }: { tx: Tx; onClick?: () => void }) {
  const { t, txSub } = useApp();
  const pos = tx.amount > 0;
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-2xl hover:bg-soft/70 transition-colors"
    >
      <TxIcon kind={tx.kind} title={tx.title} />
      <div className="flex-1 min-w-0">
        <p className="text-[14.5px] font-semibold truncate">{tx.title}</p>
        <p className="text-[12px] text-sub truncate mt-0.5">{txSub(tx)}</p>
      </div>
      <div className="text-right shrink-0">
        <p
          className={`text-[14.5px] font-bold tabular-nums ${
            pos ? "text-brand-500" : "text-ink"
          }`}
        >
          {fmtSigned(tx.amount)}
        </p>
        <StatusBadge status={tx.status} t={t} />
      </div>
    </button>
  );
}
