import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronRight, Info, Loader2, User, Wallet, type LucideIcon } from "lucide-react";
import { useState, type ButtonHTMLAttributes, type ReactNode } from "react";
import { initials, nameColor } from "../lib/format";

export { cn } from "../utils/cn";

/* ── Buttons ─────────────────────────────────────────────────────── */
interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  loading?: boolean;
  icon?: LucideIcon;
}

export function Btn({
  variant = "primary",
  loading,
  icon: Icon,
  className = "",
  children,
  disabled,
  ...rest
}: BtnProps) {
  const styles =
    variant === "primary"
      ? "bg-brand-500 text-white hover:bg-brand-600 shadow-[0_8px_20px_rgb(22_138_69/0.24)]"
      : variant === "secondary"
        ? "bg-surface text-ink border border-line hover:bg-soft"
        : variant === "danger"
          ? "bg-danger text-white hover:opacity-90"
          : "bg-transparent text-sub hover:text-ink";
  return (
    <motion.button
      whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
      disabled={disabled || loading}
      className={`h-14 w-full rounded-2xl px-5 text-[15px] font-semibold transition-colors flex items-center justify-center gap-2 select-none disabled:opacity-50 disabled:pointer-events-none ${styles} ${className}`}
      {...(rest as any)}
    >
      {loading ? (
        <Loader2 size={20} className="animate-spin" />
      ) : (
        <>
          {Icon && <Icon size={19} strokeWidth={2.2} />}
          {children}
        </>
      )}
    </motion.button>
  );
}

/* ── Cards & layout ──────────────────────────────────────────────── */
export function Card({
  className = "",
  children,
  onClick,
  hover,
}: {
  className?: string;
  children: ReactNode;
  onClick?: () => void;
  hover?: boolean;
}) {
  const base = `bg-surface border border-line rounded-[20px] shadow-card ${className}`;
  if (onClick) {
    return (
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className={`${base} text-left w-full ${hover ?? true ? "hover:border-brand-200" : ""}`}
      >
        {children}
      </motion.button>
    );
  }
  return <div className={base}>{children}</div>;
}

export function SectionTitle({
  title,
  action,
  onAction,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex items-center justify-between px-1">
      <h2 className="text-[17px] font-semibold tracking-tight">{title}</h2>
      {action && (
        <button
          onClick={onAction}
          className="text-[13px] font-semibold text-brand-500 hover:text-brand-600 flex items-center gap-0.5"
        >
          {action}
          <ChevronRight size={15} />
        </button>
      )}
    </div>
  );
}

/* ── Avatar ──────────────────────────────────────────────────────── */
export function Avatar({
  name,
  size = 44,
  src,
  className = "",
}: {
  name: string;
  size?: number;
  src?: string;
  className?: string;
}) {
  const [err, setErr] = useState(false);
  const c = nameColor(name);
  if (src && !err) {
    return (
      <img
        src={src}
        alt={name}
        onError={() => setErr(true)}
        style={{ width: size, height: size }}
        className={`rounded-full object-cover shrink-0 ${className}`}
      />
    );
  }
  return (
    <div
      style={{ width: size, height: size, background: `${c}1a`, color: c }}
      className={`rounded-full flex items-center justify-center font-bold shrink-0 ${className}`}
    >
      <span style={{ fontSize: size * 0.34 }}>{initials(name)}</span>
    </div>
  );
}

/* ── List row (profile / settings) ──────────────────────────────── */
export function ListRow({
  icon: Icon,
  tint = "#168A45",
  title,
  sub,
  right,
  onClick,
  danger,
}: {
  icon: LucideIcon;
  tint?: string;
  title: string;
  sub?: string;
  right?: ReactNode;
  onClick?: () => void;
  danger?: boolean;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.985 }}
      onClick={onClick}
      className="w-full flex items-center gap-3.5 px-4 py-3.5 text-left"
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: `${danger ? "#D93636" : tint}14`, color: danger ? "#D93636" : tint }}
      >
        <Icon size={18} strokeWidth={2.1} />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-[14.5px] font-medium truncate ${danger ? "text-danger" : ""}`}>{title}</p>
        {sub && <p className="text-[12px] text-sub truncate mt-0.5">{sub}</p>}
      </div>
      {right ?? <ChevronRight size={17} className="text-sub shrink-0" />}
    </motion.button>
  );
}

/* ── Modal ───────────────────────────────────────────────────────── */
export function Modal({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex items-center justify-center p-5"
        >
          <div
            className="absolute inset-0 bg-[#081411]/50 backdrop-blur-[2px]"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 14 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 10 }}
            transition={{ type: "spring", stiffness: 420, damping: 30 }}
            className="relative bg-surface border border-line rounded-3xl shadow-pop p-5 w-full max-w-[340px]"
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── Empty state ─────────────────────────────────────────────────── */
export function Empty({
  icon: Icon,
  title,
  sub,
}: {
  icon: LucideIcon;
  title: string;
  sub?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-14 text-center">
      <div className="w-16 h-16 rounded-3xl bg-soft text-brand-500 flex items-center justify-center">
        <Icon size={28} />
      </div>
      <p className="mt-4 text-[15px] font-semibold">{title}</p>
      {sub && <p className="mt-1 text-[13px] text-sub">{sub}</p>}
    </div>
  );
}

/* ── Toggle switch ───────────────────────────────────────────────── */
export function Switch({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      className={`w-12 h-7 rounded-full relative transition-colors ${on ? "bg-brand-500" : "bg-line"}`}
      aria-pressed={on}
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 500, damping: 32 }}
        className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow ${on ? "right-1" : "left-1"}`}
      />
    </button>
  );
}

/* ── Square contact avatar (person glyph, used in Send Money) ──── */
export function SquareAvatar({ size = 48, tone = "#F2A61B" }: { size?: number; tone?: string }) {
  return (
    <div
      style={{ width: size, height: size, background: tone }}
      className="rounded-[14px] flex items-center justify-center shrink-0"
    >
      <User size={size * 0.56} className="text-white" fill="white" strokeWidth={0} />
    </div>
  );
}

/* ── ethio telecom swirl mark ───────────────────────────────────── */
export function TelecomMark({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 48" fill="none">
      <path d="M48 12C39 4 25 2 14 7 5 11 1 20 4 29c3 10 14 15 25 14 8-1 15-6 19-13-8 5-17 6-24 2-7-4-9-12-4-18 5-6 15-7 28-2Z" fill="#0875A5" />
      <path d="M48 12C39 4 25 2 14 7 6 11 2 18 3 25c6-7 15-11 25-10 7 1 14 4 20 9 2-4 2-8 0-12Z" fill="#8CC63F" />
      <path d="M8 31c7 9 19 12 30 7-9 8-24 8-32-1-6-7-6-16-1-23-2 6-1 12 3 17Z" fill="#00A8E1" />
    </svg>
  );
}

/** Full "ethio telecom" wordmark lockup, as it appears in the app bar. */
export function EthioTelecomLogo({ scale = 1 }: { scale?: number }) {
  return (
    <img
      src="https://assets.euromoneydigital.com/dims4/default/cc1753c/2147483647/strip/true/crop/655x355+0+0/resize/840x455!/quality/90/?url=http://euromoney-brightspot.s3.amazonaws.com/c1/d4/12a01c3d4221b839aa63a08954bc/ethiotel-public-offering.png"
      alt="ethio telecom"
      className="h-auto w-[118px] object-contain mix-blend-multiply"
      style={{ transform: `scale(${scale})`, transformOrigin: "left center" }}
    />
  );
}

/** "telebirr" wordmark with its star/swoosh glyph. */
export function TelebirrLogo({ scale = 1 }: { scale?: number }) {
  return (
    <img
      src="https://www.2merkato.com/images/stories/TeleBirr-Logo.png"
      alt="telebirr"
      className="h-auto w-[92px] object-contain mix-blend-multiply"
      style={{ transform: `scale(${scale})`, transformOrigin: "right center" }}
    />
  );
}

/* ── Ethiopian flag (SVG, no emoji) ─────────────────────────────── */
export function FlagET({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size * 1.35}
      height={size}
      viewBox="0 0 30 22"
      className="rounded-[5px] ring-1 ring-black/10 shrink-0"
      aria-label="Ethiopia"
    >
      <rect width="30" height="22" fill="#FCDD09" />
      <rect width="30" height="7.4" fill="#078930" />
      <rect y="14.6" width="30" height="7.4" fill="#DA121A" />
      <circle cx="15" cy="11" r="5.4" fill="#0F47AF" />
      <path
        d="M15 7.4l.93 2.86h3.01l-2.44 1.77.93 2.86L15 13.12l-2.43 1.77.93-2.86-2.44-1.77h3.01z"
        fill="#FCDD09"
      />
    </svg>
  );
}

/* ── Logo ────────────────────────────────────────────────────────── */
export function Logo({ size = 44, dark = false }: { size?: number; dark?: boolean }) {
  return (
    <div
      style={{ width: size, height: size }}
      className={`rounded-[28%] flex items-center justify-center shadow-card ${
        dark ? "bg-surface" : "bg-gradient-to-br from-brand-400 via-brand-500 to-brand-700"
      }`}
    >
      <Wallet size={size * 0.52} strokeWidth={2.2} className={dark ? "text-brand-500" : "text-white"} />
    </div>
  );
}

/* ── Status badge ────────────────────────────────────────────────── */
export function StatusBadge({ status, t }: { status: string; t: (k: string) => string }) {
  const ok = status === "Completed";
  return (
    <span
      className={`inline-flex items-center gap-1 text-[11px] font-medium ${
        ok ? "text-brand-500" : "text-warn"
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${ok ? "bg-brand-500" : "bg-warn"}`} />
      {ok ? t("status.completed") : t("status.pending")}
    </span>
  );
}

/* ── Toast check helper ──────────────────────────────────────────── */
export function ToastInner({ msg, ok }: { msg: string; ok: boolean }) {
  return (
    <div className="flex items-center gap-2.5 bg-[#0c1a12] text-white pl-2 pr-4 py-2 rounded-full shadow-pop ring-1 ring-white/10">
      <span
        className={`w-7 h-7 rounded-full flex items-center justify-center ${
          ok ? "bg-brand-500" : "bg-warn"
        }`}
      >
        {ok ? <Check size={15} strokeWidth={3} /> : <Info size={15} strokeWidth={2.6} />}
      </span>
      <span className="text-[13px] font-medium">{msg}</span>
    </div>
  );
}
