import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { useApp } from "../store/AppContext";

export default function Header({
  title,
  onBack,
  right,
  dark,
  plain,
}: {
  title: string;
  onBack?: () => void;
  right?: ReactNode;
  dark?: boolean;
  /** when true, hide back arrow */
  plain?: boolean;
}) {
  const { back } = useApp();
  return (
    <div
      className={`sticky top-0 z-30 flex items-center h-[60px] px-2 backdrop-blur-md ${
        dark ? "bg-transparent text-white" : "bg-bg/85 border-b border-line/70"
      }`}
    >
      <div className="w-11 h-11 flex items-center justify-center">
        {!plain && (
          <button
            onClick={onBack ?? back}
            aria-label="Back"
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
              dark ? "hover:bg-white/10 text-white" : "hover:bg-soft text-ink"
            }`}
          >
            <ArrowLeft size={21} strokeWidth={2.2} />
          </button>
        )}
      </div>
      <h1 className="flex-1 text-center text-[17px] font-semibold tracking-tight truncate">
        {title}
      </h1>
      <div className="w-11 h-11 flex items-center justify-center">{right}</div>
    </div>
  );
}
