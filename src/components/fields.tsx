import { Eye, EyeOff, type LucideIcon } from "lucide-react";
import { useState, type ReactNode } from "react";
import { FlagET } from "./primitives";

/* ── Field shell with label ─────────────────────────────────────── */
export function Field({
  label,
  children,
  error,
}: {
  label?: string;
  children: ReactNode;
  error?: string | null;
}) {
  return (
    <div>
      {label && (
        <label className="block text-[13px] font-medium text-sub mb-2 px-1">{label}</label>
      )}
      {children}
      {error && <p className="mt-2 px-1 text-[12.5px] font-medium text-danger">{error}</p>}
    </div>
  );
}

const inputBase =
  "w-full bg-surface border border-line rounded-[14px] h-14 px-4 text-[15px] text-ink placeholder:text-sub/60 outline-none transition-colors focus:border-brand-400 focus:ring-4 focus:ring-brand-500/10";

/* ── Text input ─────────────────────────────────────────────────── */
export function TextInput({
  icon: Icon,
  value,
  onChange,
  placeholder,
  type = "text",
  inputMode,
  right,
  autoFocus,
}: {
  icon?: LucideIcon;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  inputMode?: "numeric" | "tel" | "text" | "decimal";
  right?: ReactNode;
  autoFocus?: boolean;
}) {
  return (
    <div className="relative flex items-center">
      {Icon && <Icon size={18} className="absolute left-4 text-sub pointer-events-none" />}
      <input
        value={value}
        autoFocus={autoFocus}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        type={type}
        inputMode={inputMode}
        className={`${inputBase} ${Icon ? "pl-11" : ""} ${right ? "pr-12" : ""}`}
      />
      {right && <div className="absolute right-3 flex items-center">{right}</div>}
    </div>
  );
}

/* ── Ethiopian phone input (+251) ───────────────────────────────── */
export function formatETPhone(raw: string) {
  const d = raw.replace(/\D/g, "").slice(0, 9);
  const parts = [d.slice(0, 3), d.slice(3, 6), d.slice(6, 9)].filter(Boolean);
  return parts.join(" ");
}

export function validETPhone(raw: string) {
  return /^9\d{8}$/.test(raw.replace(/\D/g, ""));
}

export function PhoneInput({
  value,
  onChange,
  autoFocus,
  invalid,
}: {
  value: string; // digits only, up to 9
  onChange: (digits: string) => void;
  autoFocus?: boolean;
  invalid?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 bg-surface border rounded-[14px] h-14 pl-3.5 pr-4 transition-colors focus-within:ring-4 ${
        invalid
          ? "border-danger focus-within:ring-danger/10"
          : "border-line focus-within:border-brand-400 focus-within:ring-brand-500/10"
      }`}
    >
      <FlagET size={17} />
      <span className="text-[15px] font-semibold tracking-wide shrink-0">+251</span>
      <span className="w-px h-6 bg-line shrink-0" />
      <input
        value={formatETPhone(value)}
        autoFocus={autoFocus}
        inputMode="tel"
        onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 9))}
        placeholder="9XX XXX XXX"
        className="flex-1 min-w-0 bg-transparent outline-none text-[15px] tracking-[0.06em] font-medium placeholder:text-sub/50 placeholder:tracking-normal"
      />
    </div>
  );
}

/* ── PIN input with visibility toggle ───────────────────────────── */
export function PinInput({
  value,
  onChange,
  invalid,
  length = 6,
}: {
  value: string;
  onChange: (v: string) => void;
  invalid?: boolean;
  length?: number;
}) {
  const [show, setShow] = useState(false);
  return (
    <div
      className={`relative flex items-center bg-surface border rounded-[14px] h-14 transition-colors focus-within:ring-4 ${
        invalid
          ? "border-danger focus-within:ring-danger/10"
          : "border-line focus-within:border-brand-400 focus-within:ring-brand-500/10"
      }`}
    >
      <input
        value={value}
        type={show ? "text" : "password"}
        inputMode="numeric"
        autoComplete="one-time-code"
        onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, length))}
        placeholder={"•".repeat(length)}
        className="flex-1 bg-transparent h-full px-4 outline-none text-[19px] tracking-[0.5em] placeholder:tracking-[0.35em] placeholder:text-sub/50"
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="w-11 h-11 mr-1.5 rounded-xl flex items-center justify-center text-sub hover:text-ink transition-colors"
        aria-label="Toggle PIN visibility"
      >
        {show ? <EyeOff size={19} /> : <Eye size={19} />}
      </button>
    </div>
  );
}

/* ── Large centered amount input ────────────────────────────────── */
export function AmountInput({
  value,
  onChange,
  invalid,
}: {
  value: string; // digits / decimal string
  onChange: (v: string) => void;
  invalid?: boolean;
}) {
  const num = parseFloat(value || "0");
  const shown = value === "" ? "" : value;
  return (
    <div className="flex flex-col items-center pt-1 pb-2 select-none">
      <div
        className={`flex items-baseline gap-2 transition-colors ${invalid ? "text-danger" : ""}`}
      >
        <span className="text-[16px] font-semibold text-sub">ETB</span>
        <div className="relative flex items-baseline">
          <input
            value={shown}
            onChange={(e) => {
              const v = e.target.value.replace(/[^\d.]/g, "");
              if (/^\d{0,7}(\.\d{0,2})?$/.test(v)) onChange(v);
            }}
            inputMode="decimal"
            placeholder="0.00"
            className="bg-transparent outline-none text-center font-extrabold tracking-tight text-[40px] leading-none w-[7ch] placeholder:text-ink/20"
          />
        </div>
      </div>
      {value !== "" && (
        <p className="text-[12px] text-sub mt-1.5 font-medium">
          {num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Birr
        </p>
      )}
    </div>
  );
}
