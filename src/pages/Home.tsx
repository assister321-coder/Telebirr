import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDownLeft,
  BadgeInfo,
  Bell,
  Building2,
  ChevronDown,
  Clock,
  Eye,
  EyeOff,
  Landmark,
  QrCode,
  Search,
  Send,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Wallet2,
  X,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Avatar, Card, EthioTelecomLogo, SectionTitle, TelebirrLogo } from "../components/primitives";
import PromoCarousel from "../components/PromoCarousel";
import StatusBar from "../components/StatusBar";
import { greetingKey, useClock } from "../lib/useClock";
import TxRow from "../components/TxRow";
import { BANKS, NOTIFS } from "../data/mock";
import { useApp, type RouteName } from "../store/AppContext";

let bootLoaded = false;

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const rise = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } },
};

interface Service {
  key: string;
  route?: RouteName;
  toast?: boolean;
  icon: LucideIcon;
  fg: string;
  bg: string;
  badge?: string;
}

const NOTIF_ICON: Record<string, LucideIcon> = { brand: ArrowDownLeft, warn: ShieldCheck, info: Sparkles };
const NOTIF_TONE: Record<string, string> = { brand: "#168A45", warn: "#D98A00", info: "#2B7CD3" };

function HomeSkeleton() {
  return (
    <div className="px-4 pt-4 space-y-4 animate-pulse">
      <div className="h-[236px] rounded-b-[28px] shimmer" />
      <div className="grid grid-cols-4 gap-3 px-1">
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div key={i} className="h-[74px] rounded-2xl shimmer" />
        ))}
      </div>
      <div className="h-[128px] rounded-2xl shimmer" />
    </div>
  );
}

export default function Home() {
  const { t, user, navigate, resetTo, txs, toast, lang, setLang, balance, balanceHidden, toggleHidden } = useApp();
  const [loaded, setLoaded] = useState(bootLoaded);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifTab, setNotifTab] = useState<"notifications" | "history">("notifications");
  const [langOpen, setLangOpen] = useState(false);
  const [read, setRead] = useState<string[]>([]);
  const [showSub, setShowSub] = useState(false);
  const [sendChooserOpen, setSendChooserOpen] = useState(false);
  const now = useClock(30000);

  useEffect(() => {
    if (bootLoaded) return;
    const id = window.setTimeout(() => {
      bootLoaded = true;
      setLoaded(true);
    }, 700);
    return () => window.clearTimeout(id);
  }, []);

  const recent = useMemo(() => txs.slice(0, 5), [txs]);
  const firstName = user.name.split(" ")[0];
  const unread = NOTIFS.filter((n) => !read.includes(n.id)).length;

  const SERVICES: Service[] = [
    { key: "svc.send", route: "send", icon: Send, fg: "#168A45", bg: "rgba(22,138,69,0.11)" },
    { key: "home.cashInOut", route: "receive", icon: Wallet2, fg: "#2B7CD3", bg: "rgba(43,124,211,0.11)" },
    { key: "svc.airtime", route: "airtime", icon: Smartphone, fg: "#D98A00", bg: "rgba(217,138,0,0.13)", badge: t("home.upTo") },
    { key: "home.marketplace", toast: true, icon: ShoppingBag, fg: "#C24E7E", bg: "rgba(194,78,126,0.11)" },
    { key: `loan-${BANKS[0].code}`, toast: true, icon: Building2, fg: BANKS[0].color, bg: `${BANKS[0].color}1c` },
    { key: `loan-${BANKS[1].code}`, toast: true, icon: Building2, fg: BANKS[1].color, bg: `${BANKS[1].color}1c` },
    { key: `loan-${BANKS[2].code}`, toast: true, icon: Building2, fg: BANKS[2].color, bg: `${BANKS[2].color}1c` },
    { key: "svc.bank", route: "bank", icon: Landmark, fg: "#7C5CE0", bg: "rgba(124,92,224,0.11)" },
  ];

  const labelFor = (key: string) => {
    if (key.startsWith("loan-")) {
      const code = key.split("-")[1];
      const bank = BANKS.find((b) => b.code === code)!;
      return t("home.loanWith").replace("{bank}", bank.code);
    }
    return t(key);
  };

  if (!loaded) return <HomeSkeleton />;

  return (
    <div className="relative bg-bg">
      {/* status bar + dual logo bar */}
      <div className="bg-[#8CC63F] text-white">
        <StatusBar dark className="!h-14 text-[16px]" />
      </div>
      <div className="flex h-[50px] items-center justify-between overflow-visible px-4 bg-white border-b border-[#e7ece8]">
        <div className="flex h-full w-[150px] min-w-0 shrink-0 items-center overflow-hidden">
          <EthioTelecomLogo scale={1} />
        </div>
        <div className="flex h-full w-[118px] min-w-0 shrink-0 items-center justify-end overflow-hidden">
          <TelebirrLogo scale={1} />
        </div>
      </div>

      {/* green wavy hero */}
      <div className="relative min-h-[310px] overflow-hidden bg-[#8CC63F] text-white pb-6 pt-3 px-4">
        <svg className="absolute inset-0 w-full h-full opacity-[0.2]" viewBox="0 0 400 350" preserveAspectRatio="none">
          {Array.from({ length: 13 }).map((_, index) => (
            <path key={index} d={`M-${40 + index * 8} ${40 + index * 15} C${75 + index * 2} ${-10 + index * 11}, ${125 + index * 4} ${85 + index * 8}, ${205 + index * 5} ${35 + index * 15} S${350 + index * 7} ${110 + index * 12}, 445 ${55 + index * 18}`} stroke="white" strokeWidth="1" fill="none" />
          ))}
          {Array.from({ length: 8 }).map((_, index) => (
            <path key={`lower-${index}`} d={`M-${30 + index * 8} ${230 + index * 13} C${70 + index * 4} ${180 + index * 8}, ${130 + index * 3} ${270 + index * 7}, ${230 + index * 5} ${220 + index * 13} S${365 + index * 5} ${300 + index * 9}, 450 ${245 + index * 14}`} stroke="white" strokeWidth="1" fill="none" />
          ))}
        </svg>

        <div className="relative flex items-center gap-3">
          <button onClick={() => navigate("profile")}>
            <span className="block h-[48px] w-[48px] rounded-full bg-[#f52250]" aria-label={user.name} />
          </button>
          <p className="flex-1 min-w-0 text-[18px] font-normal truncate">
            {t(greetingKey(now))}, {firstName}
          </p>
          <button onClick={() => toast(t("demo.feature"), false)} className="w-9 h-9 flex items-center justify-center">
            <Search size={22} strokeWidth={1.8} />
          </button>
          <button onClick={() => setNotifOpen(true)} className="relative w-9 h-9 flex items-center justify-center">
            <Bell size={22} strokeWidth={1.8} />
            {unread > 0 && <span className="absolute top-1 right-1.5 w-1.5 h-1.5 rounded-full bg-warn" />}
          </button>
          <div className="relative">
            <button
              onClick={() => setLangOpen((v) => !v)}
              className="flex items-center gap-0.5 text-[18px] font-normal"
            >
              {lang === "en" ? "En" : "አማ"}
              <ChevronDown size={13} />
            </button>
            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute right-0 top-6 z-20 bg-surface text-ink border border-line rounded-xl shadow-pop overflow-hidden w-28"
                >
                  {(["en", "am"] as const).map((l) => (
                    <button
                      key={l}
                      onClick={() => { setLang(l); setLangOpen(false); }}
                      className="w-full text-left px-3 py-2 text-[12.5px] font-medium hover:bg-soft"
                    >
                      {l === "en" ? "English" : "አማርኛ"}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="relative flex flex-col items-center mt-5">
          <button onClick={toggleHidden} className="flex items-center gap-2 text-[18px] font-semibold">
            {t("bal.available")}
            {balanceHidden ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
          <p className="text-[30px] font-bold tracking-tight mt-2 tabular-nums">
            {balanceHidden ? "••••••" : balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div className="relative grid grid-cols-2 gap-3 mt-4 max-w-[440px] mx-auto">
          <button onClick={() => setShowSub((v) => !v)} className="text-center">
              <span className="flex items-center gap-2 text-[15px] font-semibold">
                {t("home.savings")}
                {showSub ? <Eye size={11} /> : <EyeOff size={11} />}
              </span>
              <p className="text-[20px] font-bold mt-1">{showSub ? "1,050.00" : "--"}</p>
          </button>
          <button onClick={() => setShowSub((v) => !v)} className="text-center">
              <span className="flex items-center gap-2 text-[15px] font-semibold">
                {t("home.rewards")}
                {showSub ? <Eye size={11} /> : <EyeOff size={11} />}
              </span>
              <p className="text-[20px] font-bold mt-1">{showSub ? "18.40" : "0.00"}</p>
          </button>
        </div>
      </div>

      {/* orange strip */}
      <div className="bg-[#F2B735] text-white text-[16px] font-bold tracking-wide px-5 py-1 flex items-center justify-end gap-1.5 h-[25px] overflow-hidden">
        <Sparkles size={12} className="shrink-0" />
        <span className="truncate">{t("home.oneApp")}</span>
      </div>

      <motion.div variants={stagger} initial="hidden" animate="show" className="bg-white px-4 pt-4 pb-5 lg:px-8">
        <motion.div variants={rise} className="mb-3 flex items-center gap-2 text-[11px] font-semibold text-brand-700 dark:text-brand-300 bg-soft border border-brand-100/80 rounded-full px-3 py-1.5 w-fit">
          <BadgeInfo size={12} />
          {t("app.demoBadge")}
        </motion.div>

        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-7 lg:items-start">
          <div className="space-y-5">
            {/* service grid */}
            <motion.div variants={rise} className="grid grid-cols-4 gap-x-3 gap-y-3">
              {SERVICES.map((s, index) => {
                const Icon = s.icon;
                return (
                  <button
                    key={s.key}
                    onClick={() => {
                      if (s.key === "svc.send") {
                        setSendChooserOpen(true);
                      } else if (s.toast) {
                        toast(t("demo.feature"), false);
                      } else if (s.route) {
                        navigate(s.route);
                      }
                    }}
                    className="flex flex-col items-center justify-center gap-2 relative min-w-0 min-h-[170px] rounded-[14px] bg-white px-1.5 py-2"
                  >
                    {s.badge && (
                      <span className="absolute -top-1.5 right-0 xs:right-1 bg-warn text-white text-[8px] xs:text-[8.5px] font-bold px-1.5 py-[1px] rounded-full z-10 whitespace-nowrap">
                        {s.badge}
                      </span>
                    )}
                    <span
                      className={`flex h-10 w-10 items-center justify-center shrink-0 xs:h-[42px] xs:w-[42px] ${index === 3 ? "rounded-full bg-[#073d32] text-[7px] font-bold text-white" : ""}`}
                      style={index === 3 ? undefined : { color: s.fg }}
                    >
                      {index === 3 ? "ZEMEN" : <Icon size={index < 4 ? 30 : 26} strokeWidth={1.5} />}
                    </span>
                    <span className="text-[12.5px] font-normal text-center leading-tight text-ink w-full break-words hyphens-auto">
                      {[
                        "Send Money",
                        "Cash In/Out",
                        "Airtime/Buy Package",
                        "Zemen GEBEYA",
                        "Financial Service With Dashen",
                        "Financial Service With CBE",
                        "Financial Service with Sinqee",
                        "Transfer to Bank",
                      ][index] ?? labelFor(s.key)}
                    </span>
                  </button>
                );
              })}
            </motion.div>

            {/* promo carousel */}
            <motion.div variants={rise}>
              <PromoCarousel />
            </motion.div>

            {/* scan qr */}
            <motion.button
              variants={rise}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("scan")}
              className="w-full h-[48px] rounded-2xl bg-[#2F80ED] hover:bg-[#2569c4] text-white font-bold text-[14px] flex items-center justify-center gap-2 shadow-[0_10px_22px_rgba(47,128,237,0.3)] transition-colors"
            >
              <QrCode size={17} />
              {t("home.scanQr")}
            </motion.button>
          </div>

          {/* recent transactions */}
          <motion.div variants={rise} className="home-recent space-y-3 mt-6 lg:mt-0">
            <SectionTitle title={t("home.recent")} action={t("common.seeAll")} onAction={() => resetTo("transactions")} />
            <Card className="py-1.5 divide-y divide-line/70 lg:py-2">
              {recent.map((tx) => (
                <TxRow key={tx.id} tx={tx} onClick={() => navigate("txdetail", { tx })} />
              ))}
            </Card>
          </motion.div>
        </div>
      </motion.div>

      <AnimatePresence>
        {sendChooserOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[75]"
          >
            <div className="absolute inset-0 bg-black/45" onClick={() => setSendChooserOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              className="absolute left-6 top-[56%] w-[235px] overflow-hidden rounded-[18px] bg-white shadow-pop"
            >
              <button
                onClick={() => { setSendChooserOpen(false); navigate("send"); }}
                className="flex w-full items-center gap-4 px-6 py-5 text-left text-[18px] text-[#24352b]"
              >
                <Send size={24} strokeWidth={1.6} className="text-[#8CC63F]" />
                <span>To Individual</span>
              </button>
              <div className="h-px bg-[#edf0ec]" />
              <button
                onClick={() => { setSendChooserOpen(false); toast(t("demo.feature"), false); }}
                className="flex w-full items-center gap-4 px-6 py-5 text-left text-[18px] text-[#24352b]"
              >
                <UsersRound size={24} strokeWidth={1.6} className="text-[#8CC63F]" />
                <span>To Group</span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* notifications panel */}
      <AnimatePresence>
        {notifOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[70]">
            <div className="absolute inset-0 bg-[#081411]/45 backdrop-blur-[2px]" onClick={() => setNotifOpen(false)} />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 38 }}
              className="absolute bottom-0 inset-x-0 lg:left-auto lg:right-8 lg:bottom-auto lg:top-20 lg:w-[380px] bg-surface rounded-t-3xl lg:rounded-3xl border border-line shadow-pop p-4 max-h-[78vh] overflow-y-auto no-scrollbar"
            >
              <div className="flex items-center justify-between px-1 py-1">
                <h3 className="text-[17px] font-bold">{t("home.notifs")}</h3>
                <button onClick={() => setNotifOpen(false)} className="w-8 h-8 rounded-full hover:bg-soft flex items-center justify-center text-sub">
                  <X size={17} />
                </button>
              </div>

              {/* tabs */}
              <div className="flex gap-1 mt-3 bg-soft rounded-xl p-1">
                <button
                  onClick={() => setNotifTab("notifications")}
                  className={`flex-1 h-9 rounded-lg text-[13px] font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                    notifTab === "notifications" ? "bg-white text-ink shadow-sm" : "text-sub hover:text-ink"
                  }`}
                >
                  <Bell size={14} />
                  {t("notif.tab.notifications")}
                </button>
                <button
                  onClick={() => setNotifTab("history")}
                  className={`flex-1 h-9 rounded-lg text-[13px] font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                    notifTab === "history" ? "bg-white text-ink shadow-sm" : "text-sub hover:text-ink"
                  }`}
                >
                  <Clock size={14} />
                  {t("notif.tab.history")}
                </button>
              </div>

              {notifTab === "notifications" ? (
                <>
                  <div className="mt-3 space-y-1">
                    {NOTIFS.map((n) => {
                      const Icon = NOTIF_ICON[n.tone];
                      const tone = NOTIF_TONE[n.tone];
                      const isRead = read.includes(n.id);
                      return (
                        <button
                          key={n.id}
                          onClick={() => setRead((r) => [...new Set([...r, n.id])])}
                          className="w-full flex gap-3 p-3 rounded-2xl hover:bg-soft/70 text-left transition-colors"
                        >
                          <span className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${tone}14`, color: tone }}>
                            <Icon size={18} />
                          </span>
                          <span className="flex-1 min-w-0">
                            <span className="flex items-center gap-2">
                              <span className="text-[13.5px] font-semibold truncate">{lang === "am" ? n.am.title : n.en.title}</span>
                              {!isRead && <span className="w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0" />}
                            </span>
                            <span className="block text-[12px] text-sub mt-0.5 leading-snug">{lang === "am" ? n.am.body : n.en.body}</span>
                          </span>
                          <span className="text-[11px] text-sub shrink-0">{n.ago}</span>
                        </button>
                      );
                    })}
                  </div>
                  <button onClick={() => setRead(NOTIFS.map((n) => n.id))} className="mt-2 w-full py-2.5 text-[13px] font-semibold text-brand-500 rounded-xl hover:bg-soft">
                    {t("common.markAll")}
                  </button>
                </>
              ) : (
                <div className="mt-3">
                  {txs.length === 0 ? (
                    <div className="flex flex-col items-center py-10 text-center">
                      <div className="w-14 h-14 rounded-2xl bg-soft text-brand-500 flex items-center justify-center">
                        <Clock size={24} />
                      </div>
                      <p className="mt-3 text-[14px] font-semibold text-ink">{t("notif.history.empty")}</p>
                      <p className="mt-1 text-[12px] text-sub">{t("notif.history.emptySub")}</p>
                    </div>
                  ) : (
                    <div className="space-y-0.5">
                      {txs.map((tx) => (
                        <TxRow key={tx.id} tx={tx} onClick={() => { setNotifOpen(false); navigate("txdetail", { tx }); }} />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
