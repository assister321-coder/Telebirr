import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";

/** Backspace glyph: X inside a left-pointing pentagon (Android keypad style). */
function BackspaceIcon() {
  return (
    <svg width="26" height="20" viewBox="0 0 26 20" fill="none">
      <path
        d="M8.4 1.6h14.2a2.4 2.4 0 0 1 2.4 2.4v12a2.4 2.4 0 0 1-2.4 2.4H8.4a2.4 2.4 0 0 1-1.75-.76L1.2 11.2a1.8 1.8 0 0 1 0-2.4l5.45-6.44A2.4 2.4 0 0 1 8.4 1.6z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M11.6 7.2l6 5.6M17.6 7.2l-6 5.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export default function NumberPad({
  onDigit,
  onDot,
  onBackspace,
  onSubmit,
  submitLabel,
  submitEnabled = true,
}: {
  onDigit: (d: string) => void;
  onDot: () => void;
  onBackspace: () => void;
  onSubmit: () => void;
  submitLabel: string;
  submitEnabled?: boolean;
}) {
  const Key = ({
    children,
    onClick,
    span,
    muted,
  }: {
    children: ReactNode;
    onClick: () => void;
    span?: boolean;
    muted?: boolean;
  }) => (
    <motion.button
      whileTap={{ scale: 0.95, backgroundColor: "#ECEFEC" }}
      onClick={onClick}
      className={`rounded-[7px] bg-white flex items-center justify-center font-semibold text-ink shadow-[0_1px_1px_rgba(0,0,0,0.06)] select-none ${
        span ? "col-span-2" : ""
      } ${muted ? "text-[#3a423d]" : "text-[23px]"}`}
    >
      {children}
    </motion.button>
  );

  return (
    <div className="shrink-0 bg-[#F1F3F1] dark:bg-[#111a14] pb-[max(env(safe-area-inset-bottom),8px)] select-none">
      {/* collapse handle */}
      <div className="flex justify-center py-1.5">
        <ChevronDown size={22} className="text-[#7a837d]" />
      </div>

      <div className="grid grid-cols-4 gap-[7px] px-2 [grid-template-rows:repeat(4,minmax(48px,10.5svh))]">
        <Key onClick={() => onDigit("1")}>1</Key>
        <Key onClick={() => onDigit("2")}>2</Key>
        <Key onClick={() => onDigit("3")}>3</Key>
        <Key onClick={onBackspace} muted>
          <BackspaceIcon />
        </Key>

        <Key onClick={() => onDigit("4")}>4</Key>
        <Key onClick={() => onDigit("5")}>5</Key>
        <Key onClick={() => onDigit("6")}>6</Key>
        <motion.button
          whileTap={{ scale: submitEnabled ? 0.97 : 1 }}
          disabled={!submitEnabled}
          onClick={onSubmit}
          style={{ gridRow: "span 3" }}
          className={`rounded-[7px] flex items-center justify-center text-[19px] font-bold text-white transition-colors ${
            submitEnabled ? "bg-[#8CC63F] active:bg-[#7ab234]" : "bg-[#D8E8C4] text-white/85"
          }`}
        >
          {submitLabel}
        </motion.button>

        <Key onClick={() => onDigit("7")}>7</Key>
        <Key onClick={() => onDigit("8")}>8</Key>
        <Key onClick={() => onDigit("9")}>9</Key>

        <Key onClick={() => onDigit("0")} span>0</Key>
        <Key onClick={onDot}>.</Key>
      </div>
    </div>
  );
}
