import { motion } from "framer-motion";
import { Eye, EyeOff, TrendingUp, Wallet } from "lucide-react";
import { useApp } from "../store/AppContext";

export default function BalanceCard() {
  const { balance, balanceHidden, toggleHidden, user, t } = useApp();
  const whole = Math.floor(balance).toLocaleString("en-US");
  const cents = (balance % 1).toFixed(2).slice(1);

  return (
    <div className="relative overflow-hidden rounded-[22px] p-5 lg:p-6 text-white shadow-[0_18px_38px_-14px_rgb(8_65_31/0.55)] bg-gradient-to-br from-brand-400 via-brand-500 to-brand-800">
      {/* decorative rings */}
      <svg
        className="absolute -right-14 -top-20 w-[290px] h-[290px] opacity-[0.16] pointer-events-none"
        viewBox="0 0 200 200"
        fill="none"
      >
        <circle cx="130" cy="70" r="90" stroke="white" strokeWidth="1.4" />
        <circle cx="130" cy="70" r="62" stroke="white" strokeWidth="1.4" />
        <circle cx="130" cy="70" r="122" stroke="white" strokeWidth="1.4" strokeDasharray="4 7" />
      </svg>
      <svg
        className="absolute -left-20 top-1/2 w-[240px] h-[240px] opacity-[0.06] pointer-events-none"
        viewBox="0 0 24 24"
        fill="white"
      >
        <path d="M6 3l4 4-3.5 3.5L2.5 6.5 6 3zm12 18l-4-4 3.5-3.5 4 4L18 21zM12 2v7m0 6v7M2 12h7m6 0h7" stroke="white" strokeWidth="1.2" />
      </svg>

      <div className="relative">
        <div className="flex items-center justify-between">
          <p className="text-[13px] font-medium text-white/80">{t("bal.available")}</p>
          <button
            onClick={toggleHidden}
            aria-label="Toggle balance"
            className="w-9 h-9 rounded-full bg-white/12 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            {balanceHidden ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        </div>

        <div className="mt-2 min-h-[46px] flex items-end">
          {balanceHidden ? (
            <motion.p
              key="hidden"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[31px] lg:text-[34px] font-extrabold tracking-tight leading-none"
            >
              ETB ••••••
            </motion.p>
          ) : (
            <motion.p
              key="shown"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-extrabold tracking-tight leading-none"
            >
              <span className="text-[17px] font-bold align-top mr-1.5 text-white/85">ETB</span>
              <span className="text-[31px] lg:text-[34px]">
                {whole}
                <span className="text-[20px] text-white/80">{cents}</span>
              </span>
            </motion.p>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-white/14 flex items-center justify-center">
              <Wallet size={15} />
            </span>
            <div>
              <p className="text-[11px] text-white/65 leading-none">{t("bal.wallet")}</p>
              <p className="text-[13.5px] font-semibold tracking-[0.12em] mt-1 leading-none">
                •••• {user.tail}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-white/12 rounded-full px-2.5 py-1">
            <TrendingUp size={12} />
            <span className="text-[11px] font-semibold">+2,150 · {t("bal.week")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
