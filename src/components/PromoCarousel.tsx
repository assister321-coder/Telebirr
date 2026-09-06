import { AnimatePresence, motion } from "framer-motion";
import { Gift } from "lucide-react";
import { useEffect, useState } from "react";
import { useApp } from "../store/AppContext";

const SLIDES = 4;

export default function PromoCarousel({
  compact,
  dotsBelow,
}: {
  compact?: boolean;
  /** render pagination as green outlined dots underneath (receipt style) */
  dotsBelow?: boolean;
}) {
  const { t } = useApp();
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setI((v) => (v + 1) % SLIDES), 3600);
    return () => window.clearInterval(id);
  }, []);

  if (dotsBelow) {
    return (
      <div className="w-full">
        <div className="relative w-full overflow-hidden rounded-[14px] h-[150px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.45 }}
              className="absolute inset-0"
            >
              <img src="/promo-car.jpg" alt="TelePlay promotion" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-brand-900/45 via-transparent to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-center px-4">
                <div className="flex items-center gap-1.5 text-white/85 text-[10px] font-bold tracking-wide">
                  <Gift size={12} />
                  {t("promo.tag")}
                </div>
                <p className="text-white font-extrabold leading-[1.05] mt-1 text-[20px] drop-shadow">
                  {t("promo.headline1")}
                  <br />
                  <span className="text-warn">{t("promo.headline2")}</span>
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="flex justify-center gap-2 mt-2.5">
          {Array.from({ length: SLIDES }).map((_, d) => (
            <span
              key={d}
              className={`w-2 h-2 rounded-full border transition-colors ${
                d === i ? "bg-[#8CC63F] border-[#8CC63F]" : "bg-transparent border-[#b9d99a]"
              }`}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full overflow-hidden rounded-[18px] shadow-card ${compact ? "h-[92px]" : "h-[128px]"}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={i}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.45 }}
          className="absolute inset-0"
        >
          <img
            src="/promo-car.jpg"
            alt="TebiPlay promotion"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-900/55 via-brand-800/15 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-center px-4">
            <div className="flex items-center gap-1.5 text-white/85 text-[10.5px] font-bold tracking-wide">
              <Gift size={13} />
              {t("promo.tag")}
            </div>
            <p className="text-white font-extrabold leading-[1.05] mt-1 drop-shadow-sm" style={{ fontSize: compact ? 17 : 21 }}>
              {t("promo.headline1")}
              <br />
              <span className="text-warn">{t("promo.headline2")}</span>
            </p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* dots */}
      <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1.5">
        {Array.from({ length: SLIDES }).map((_, d) => (
          <span
            key={d}
            className={`h-1.5 rounded-full transition-all ${d === i ? "w-4 bg-white" : "w-1.5 bg-white/45"}`}
          />
        ))}
      </div>
    </div>
  );
}
