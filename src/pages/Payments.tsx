import { motion } from "framer-motion";
import {
  ChevronRight,
  Landmark,
  Lightbulb,
  QrCode,
  Send,
  Smartphone,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import Header from "../components/Header";
import { Avatar, Card } from "../components/primitives";
import { CONTACTS } from "../data/mock";
import { useApp, type RouteName } from "../store/AppContext";

interface Row {
  key: string;
  route: RouteName;
  icon: LucideIcon;
  fg: string;
  bg: string;
  label: string;
  sub: string;
}

const MOVE: Row[] = [
  { key: "send", route: "send", icon: Send, fg: "#168A45", bg: "rgba(22,138,69,0.11)", label: "send.title", sub: "send.choose" },
  { key: "receive", route: "receive", icon: Wallet, fg: "#7C5CE0", bg: "rgba(124,92,224,0.11)", label: "recv.title", sub: "recv.scanMe" },
  { key: "qr", route: "scan", icon: QrCode, fg: "#0E9488", bg: "rgba(14,148,136,0.12)", label: "svc.qr", sub: "scan.hint" },
];

const BUY: Row[] = [
  { key: "airtime", route: "airtime", icon: Smartphone, fg: "#C24E7E", bg: "rgba(194,78,126,0.11)", label: "svc.airtime", sub: "airtime.provider" },
  { key: "bills", route: "bills", icon: Lightbulb, fg: "#C47F00", bg: "rgba(217,138,0,0.12)", label: "svc.bills", sub: "bills.choose" },
  { key: "bank", route: "bank", icon: Landmark, fg: "#2B7CD3", bg: "rgba(43,124,211,0.11)", label: "svc.bank", sub: "bank.select" },
];

function PayRow({ r }: { r: Row }) {
  const { t, navigate } = useApp();
  const Icon = r.icon;
  return (
    <motion.button
      whileTap={{ scale: 0.985 }}
      onClick={() => navigate(r.route)}
      className="w-full flex items-center gap-3.5 px-4 py-3.5 text-left"
    >
      <span
        className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
        style={{ background: r.bg, color: r.fg }}
      >
        <Icon size={20} strokeWidth={2.1} />
      </span>
      <span className="flex-1 min-w-0">
        <span className="block text-[14.5px] font-semibold">{t(r.label)}</span>
        <span className="block text-[12px] text-sub truncate mt-0.5">{t(r.sub)}</span>
      </span>
      <ChevronRight size={18} className="text-sub shrink-0" />
    </motion.button>
  );
}

export default function Payments() {
  const { t, navigate } = useApp();

  return (
    <div className="min-h-full bg-bg">
      <Header title={t("pay.title")} plain />
      <div className="px-4 lg:px-8 py-5 max-w-[640px] mx-auto space-y-6">
        <div>
          <p className="text-[13px] font-semibold text-sub mb-2 px-1">{t("pay.move")}</p>
          <Card className="divide-y divide-line/70 py-1">
            {MOVE.map((r) => <PayRow key={r.key} r={r} />)}
          </Card>
        </div>

        <div>
          <p className="text-[13px] font-semibold text-sub mb-2 px-1">{t("pay.buy")}</p>
          <Card className="divide-y divide-line/70 py-1">
            {BUY.map((r) => <PayRow key={r.key} r={r} />)}
          </Card>
        </div>

        <div>
          <div className="flex items-baseline justify-between px-1 mb-3">
            <p className="text-[13px] font-semibold text-sub">{t("pay.saved")}</p>
            <p className="text-[11.5px] text-sub/70">{t("pay.tapSend")}</p>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {CONTACTS.slice(0, 8).map((c) => (
              <motion.button
                key={c.phone}
                whileTap={{ scale: 0.92 }}
                onClick={() => navigate("send", { prefill: c })}
                className="flex flex-col items-center gap-2"
              >
                <Avatar name={c.name} size={52} />
                <span className="text-[11.5px] text-sub font-medium truncate w-full text-center">
                  {c.name.split(" ")[0]}
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
