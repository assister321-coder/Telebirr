import { motion } from "framer-motion";
import { useEffect } from "react";
import { TelebirrLogo } from "../components/primitives";
import { useApp } from "../store/AppContext";

export default function Splash() {
  const { resetTo, t } = useApp();

  useEffect(() => {
    const id = window.setTimeout(() => resetTo("login"), 7000);
    return () => window.clearTimeout(id);
  }, [resetTo]);

  return (
    <div
      className="min-h-full h-full relative overflow-hidden bg-[#8CC63F] text-white"
      style={{
        backgroundImage:
          "radial-gradient(circle at 18% 18%, transparent 0 20px, rgb(255 255 255 / 0.09) 21px 23px, transparent 24px), radial-gradient(circle at 78% 72%, transparent 0 28px, rgb(255 255 255 / 0.07) 29px 31px, transparent 32px)",
        backgroundSize: "76px 76px, 112px 112px",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.65, ease: "easeOut" }}
        className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-white/20"
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="relative -mt-8 flex flex-col items-center"
        >
          <div className="h-[170px] w-[380px] flex items-center justify-center">
            <TelebirrLogo scale={3} />
          </div>
          <p className="mt-8 text-[48px] font-extrabold tracking-tight text-[#0875a5]">
            Super<span className="text-[#F2A61B]">App</span>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="absolute flex h-[156px] w-[156px] items-center justify-center rounded-[18px] bg-white shadow-[0_8px_24px_rgb(33_68_20/0.12)]"
        >
          <div className="flex gap-[7px] animate-spin" style={{ animationDuration: "1.4s" }}>
            {Array.from({ length: 8 }).map((_, index) => (
              <span
                key={index}
                className="h-[14px] w-[14px] rounded-full bg-[#8CC63F]"
                style={{ transform: `rotate(${index * 45}deg) translateY(-20px)` }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
