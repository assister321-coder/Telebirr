import { AnimatePresence, motion, type Variants } from "framer-motion";
import {
  CreditCard,
  Grid3x3,
  HelpCircle,
  Home,
  LogOut,
  MapPin,
  MessageCircleHeart,
  Moon,
  QrCode,
  Settings as SettingsIcon,
  Sun,
  User,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useRef, type ComponentType } from "react";
import { useApp, type NavDir, type RouteName } from "../store/AppContext";
import { Avatar, Logo, ToastInner, cn } from "./primitives";

import Splash from "../pages/Splash";
import Login from "../pages/Login";
import HomePage from "../pages/Home";
import Payments from "../pages/Payments";
import SendMoney from "../pages/SendMoney";
import SendAmount from "../pages/SendAmount";
import { ConfirmScreen } from "../pages/PayFlow";
import Success from "../pages/Success";
import Receive from "../pages/Receive";
import Scan from "../pages/Scan";
import { Airtime, Bills, Bank } from "../pages/Services";
import Transactions from "../pages/Transactions";
import TxDetail from "../pages/TxDetail";
import Profile from "../pages/Profile";
import SettingsPage from "../pages/Settings";
import Apps from "../pages/Apps";
import Engage from "../pages/Engage";

const SCREENS: Record<RouteName, ComponentType> = {
  splash: Splash,
  login: Login,
  home: HomePage,
  payments: Payments,
  send: SendMoney,
  sendAmount: SendAmount,
  confirm: ConfirmScreen,
  success: Success,
  receive: Receive,
  scan: Scan,
  airtime: Airtime,
  bills: Bills,
  bank: Bank,
  transactions: Transactions,
  txdetail: TxDetail,
  profile: Profile,
  settings: SettingsPage,
  apps: Apps,
  engage: Engage,
};

const IMMERSIVE: RouteName[] = ["splash", "login"];
/* full-screen flows: keypad / confirmation / receipt own the whole viewport */
const HIDENAV: RouteName[] = ["scan", "sendAmount", "confirm", "success"];

/** which tab should glow for a given route */
const TAB_OF: Partial<Record<RouteName, RouteName>> = {
  send: "payments",
  sendAmount: "payments",
  receive: "payments",
  confirm: "payments",
  success: "payments",
  scan: "payments",
  airtime: "payments",
  bills: "payments",
  bank: "payments",
  txdetail: "transactions",
  settings: "profile",
};

const TABS: { route: RouteName; icon: LucideIcon; key: string }[] = [
  { route: "home", icon: Home, key: "nav.home" },
  { route: "payments", icon: CreditCard, key: "nav.payments" },
  { route: "apps", icon: Grid3x3, key: "nav.apps" },
  { route: "engage", icon: MessageCircleHeart, key: "nav.engage" },
  { route: "profile", icon: User, key: "nav.account" },
];

const variants: Variants = {
  enter: (dir: NavDir) =>
    dir === "push" ? { x: 72, opacity: 0 } : dir === "pop" ? { x: -72, opacity: 0 } : { opacity: 0, scale: 0.99 },
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (dir: NavDir) =>
    dir === "push" ? { x: -72, opacity: 0 } : dir === "pop" ? { x: 72, opacity: 0 } : { opacity: 0, scale: 0.99 },
};

export default function AppShell() {
  const { route, dir, seq, t, resetTo, navigate, toasts, user, theme, setTheme, toast } = useApp();
  const scrollRef = useRef<HTMLDivElement>(null);

  const immersive = IMMERSIVE.includes(route.name);
  const activeTab: RouteName | null = IMMERSIVE.includes(route.name)
    ? null
    : (TABS.some((tb) => tb.route === route.name) ? route.name : TAB_OF[route.name] ?? null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [seq]);

  const Screen = SCREENS[route.name];

  return (
    <div className="h-dvh w-full flex bg-page text-ink relative overflow-hidden">
      {/* desktop ambient glow */}
      <div className="pointer-events-none absolute -top-40 -left-24 w-[560px] h-[560px] rounded-full bg-brand-500/10 blur-3xl hidden lg:block" />

      {/* ── Sidebar (desktop) ─────────────────────────────────────── */}
      {!immersive && (
        <aside className="hidden lg:flex w-[264px] shrink-0 flex-col border-r border-line bg-surface relative z-10">
          <div className="flex items-center gap-3 px-5 h-[72px] border-b border-line/70">
            <Logo size={38} />
            <div className="leading-tight">
              <p className="text-[16.5px] font-extrabold tracking-tight text-[#F5A623]">
                {t("app.name")}
              </p>
              <p className="text-[11px] text-sub font-medium">{t("app.tagline")}</p>
            </div>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto no-scrollbar">
            {TABS.map(({ route: r, icon: Icon, key }) => {
              const active = activeTab === r;
              return (
                <button
                  key={r}
                  onClick={() => resetTo(r)}
                  className={cn(
                    "relative w-full flex items-center gap-3 px-3.5 h-11 rounded-xl text-[14px] font-semibold transition-colors",
                    active ? "bg-soft text-brand-600 dark:text-brand-300" : "text-sub hover:bg-soft/60 hover:text-ink"
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-[3.5px] h-5 rounded-full bg-brand-500"
                    />
                  )}
                  <Icon size={19} strokeWidth={active ? 2.4 : 2.1} />
                  {t(key)}
                </button>
              );
            })}
          </nav>

          <div className="px-3 pb-3 space-y-1 border-t border-line/70 pt-3">
            <button
              onClick={() => resetTo("settings")}
              className={cn(
                "w-full flex items-center gap-3 px-3.5 h-11 rounded-xl text-[14px] font-semibold transition-colors",
                route.name === "settings" ? "bg-soft text-brand-600 dark:text-brand-300" : "text-sub hover:bg-soft/60 hover:text-ink"
              )}
            >
              <SettingsIcon size={19} strokeWidth={2.1} />
              {t("nav.settings")}
            </button>
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-full flex items-center gap-3 px-3.5 h-11 rounded-xl text-[14px] font-semibold text-sub hover:bg-soft/60 hover:text-ink transition-colors"
            >
              {theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}
              {theme === "dark" ? t("set.light") : t("set.dark")}
            </button>
            <button
              onClick={() => toast(t("demo.feature"), false)}
              className="w-full flex items-center gap-3 px-3.5 h-11 rounded-xl text-[14px] font-semibold text-sub hover:bg-soft/60 hover:text-ink transition-colors"
            >
              <HelpCircle size={19} />
              {t("nav.help")}
            </button>
          </div>

          <div className="m-3 mt-0 flex items-center gap-3 bg-soft border border-line/60 rounded-2xl px-3 py-2.5">
            <Avatar name={user.name} src="/avatar.jpg" size={36} />
            <div className="flex-1 min-w-0 leading-tight">
              <p className="text-[13px] font-bold truncate">{user.name}</p>
              <p className="text-[11px] text-sub truncate">{user.phone}</p>
            </div>
            <button
              onClick={() => resetTo("login")}
              className="w-9 h-9 rounded-xl hover:bg-surface flex items-center justify-center text-sub hover:text-danger transition-colors"
              aria-label={t("prof.signOut")}
            >
              <LogOut size={17} />
            </button>
          </div>

          <p className="px-5 pb-4 text-[10.5px] text-sub/60 font-medium">{t("app.demoBadge")}</p>
        </aside>
      )}

      {/* ── Content ───────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        <div
          ref={scrollRef}
          className="flex-1 min-h-0 overflow-y-auto overflow-x-clip no-scrollbar bg-bg"
        >
          <AnimatePresence mode="popLayout" custom={dir} initial={false}>
            <motion.div
              key={seq}
              custom={dir}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className={cn("min-h-full mx-auto w-full", !immersive && "lg:max-w-[1080px]")}
            >
              <Screen />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Bottom nav (mobile) ─────────────────────────────────── */}
        {!immersive && !HIDENAV.includes(route.name) && (
          <nav className="lg:hidden shrink-0 bg-[#8CC63F] text-white border-t border-white/20 px-2 pt-1.5 pb-[max(env(safe-area-inset-bottom),6px)] relative z-20">
            <div className="grid grid-cols-5">
              {TABS.map(({ route: r, icon: Icon, key }) => {
                const active = activeTab === r;
                return (
                  <button
                    key={r}
                    onClick={() => resetTo(r)}
                    className="relative flex flex-col items-center gap-1 py-1.5"
                  >
                    {active && (
                      <motion.span
                        layoutId="tab-dot"
                        className="absolute -top-[7px] w-1.5 h-1.5 rounded-full bg-brand-500"
                      />
                    )}
                    <span
                      className={cn(
                        "w-10 h-8 rounded-full flex items-center justify-center transition-all",
                        active ? "text-white" : "text-white/70"
                      )}
                    >
                      <Icon size={21} strokeWidth={active ? 2.5 : 2.1} />
                    </span>
                    <span
                      className={cn(
                        "text-[12px] leading-none transition-colors truncate max-w-full px-0.5",
                        active ? "font-bold text-white" : "font-medium text-white/70"
                      )}
                    >
                      {t(key)}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* floating quick-scan action, telebirr-style corner FAB */}
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate("scan")}
              className="absolute -top-7 right-4 w-14 h-14 rounded-full bg-white text-[#8CC63F] flex items-center justify-center shadow-[0_4px_12px_rgb(23_32_27/0.22)] ring-1 ring-[#8CC63F]"
              aria-label={t("home.scanQr")}
            >
              <MapPin size={32} fill="#8CC63F" strokeWidth={1.5} />
            </motion.button>
          </nav>
        )}
      </div>

      {/* ── Toasts ────────────────────────────────────────────────── */}
      <div className="fixed bottom-24 lg:bottom-10 left-1/2 -translate-x-1/2 z-[90] pointer-events-none flex flex-col items-center gap-2">
        <AnimatePresence>
          {toasts.map((t0) => (
            <motion.div
              key={t0.id}
              layout
              initial={{ opacity: 0, y: 18, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.94 }}
              transition={{ type: "spring", stiffness: 480, damping: 34 }}
            >
              <ToastInner msg={t0.msg} ok={t0.ok} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
