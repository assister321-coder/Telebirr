import { useEffect, useState } from "react";
import { clockTime, useClock } from "../lib/useClock";

/** Android-style phone status bar with a REAL live clock + real battery when available. */
export default function StatusBar({ dark, className = "" }: { dark?: boolean; className?: string }) {
  const now = useClock(1000);
  const [battery, setBattery] = useState<number | null>(null);
  const [charging, setCharging] = useState(false);

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    const nav = navigator as any;
    if (nav.getBattery) {
      nav.getBattery().then((b: any) => {
        const sync = () => {
          setBattery(Math.round(b.level * 100));
          setCharging(b.charging);
        };
        sync();
        b.addEventListener("levelchange", sync);
        b.addEventListener("chargingchange", sync);
        cleanup = () => {
          b.removeEventListener("levelchange", sync);
          b.removeEventListener("chargingchange", sync);
        };
      }).catch(() => {});
    }
    return () => cleanup?.();
  }, []);

  const fg = dark ? "text-white" : "text-ink";
  const stroke = dark ? "#FFFFFF" : "currentColor";
  const pct = battery ?? 82;

  return (
    <div
      className={`flex items-center justify-between h-7 px-3.5 text-[11.5px] font-semibold shrink-0 select-none ${fg} ${className}`}
    >
      <span className="tabular-nums">{clockTime(now)}</span>

      <div className="flex items-center gap-1.5">
        {/* wifi */}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M2 8.5a15 15 0 0 1 20 0M5 12a10.5 10.5 0 0 1 14 0M8.5 15.5a5.5 5.5 0 0 1 7 0" stroke={stroke} strokeWidth="1.9" strokeLinecap="round" />
          <circle cx="12" cy="19" r="1.3" fill={stroke} />
        </svg>
        {/* signal */}
        <svg width="14" height="14" viewBox="0 0 24 24" fill={stroke}>
          <rect x="2" y="15" width="3.4" height="6" rx="1" />
          <rect x="7.4" y="11" width="3.4" height="10" rx="1" />
          <rect x="12.8" y="7" width="3.4" height="14" rx="1" />
          <rect x="18.2" y="3" width="3.4" height="18" rx="1" opacity="0.45" />
        </svg>
        {/* battery */}
        <div className="flex items-center gap-0.5">
          <div className={`relative w-[22px] h-[11px] rounded-[3px] border ${dark ? "border-white/70" : "border-ink/50"}`}>
            <div
              className={`absolute left-[1px] top-[1px] bottom-[1px] rounded-[1.5px] ${
                charging ? "bg-brand-500" : pct <= 15 ? "bg-danger" : dark ? "bg-white" : "bg-ink"
              }`}
              style={{ width: `${Math.max(6, (pct / 100) * 18)}px` }}
            />
          </div>
          <div className={`w-[1.5px] h-[4px] rounded-r ${dark ? "bg-white/70" : "bg-ink/50"}`} />
        </div>
      </div>
    </div>
  );
}
