import { AnimatePresence, motion } from "framer-motion";
import { Flashlight, FlashlightOff, Keyboard, ScanLine, SendHorizonal, X } from "lucide-react";
import { useState } from "react";
import Header from "../components/Header";
import { Btn } from "../components/primitives";
import { useApp } from "../store/AppContext";

export default function Scan() {
  const { t, navigate, back } = useApp();
  const [torch, setTorch] = useState(false);
  const [manual, setManual] = useState(false);
  const [code, setCode] = useState("");
  const [err, setErr] = useState(false);

  const payManual = () => {
    if (!code.trim()) {
      setErr(true);
      return;
    }
    navigate("confirm", {
      flow: {
        type: "merchant",
        title: "Buna Bet Coffee",
        phone: "+251 920 334 010",
        amount: 120,
        method: "QR Pay",
      },
    });
  };

  return (
    <div className="min-h-full flex flex-col bg-[#050d09] text-white lg:rounded-[28px] lg:overflow-hidden lg:border lg:border-line lg:m-5">
      <Header title={t("scan.title")} dark right={
        <button onClick={back} className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center" aria-label="Close">
          <X size={20} />
        </button>
      } />

      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-8 max-w-[560px] w-full mx-auto">
        {/* viewfinder */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="relative w-full max-w-[300px] aspect-square"
        >
          {/* simulated camera texture */}
          <div className="absolute inset-6 rounded-3xl overflow-hidden bg-gradient-to-br from-[#0d1b13] via-[#091109] to-[#0e2115]">
            <div
              className="absolute inset-0 opacity-[0.16]"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 30% 30%, rgba(255,255,255,.5) 0, transparent 1.5px), radial-gradient(circle at 70% 60%, rgba(255,255,255,.4) 0, transparent 1.5px), radial-gradient(circle at 45% 80%, rgba(255,255,255,.35) 0, transparent 1.5px), radial-gradient(circle at 80% 20%, rgba(255,255,255,.3) 0, transparent 1.5px)",
                backgroundSize: "90px 90px, 70px 70px, 110px 110px, 60px 60px",
              }}
            />
            {torch && (
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,240,0.22),transparent_70%)]" />
            )}
            {/* laser */}
            <motion.div
              animate={{ top: ["8%", "88%", "8%"] }}
              transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-2 right-2 h-[3px] rounded-full bg-brand-400 shadow-[0_0_18px_4px_rgba(61,173,110,0.55)]"
            />
          </div>

          {/* corner brackets */}
          {[
            "top-0 left-0 border-t-[3.5px] border-l-[3.5px] rounded-tl-2xl",
            "top-0 right-0 border-t-[3.5px] border-r-[3.5px] rounded-tr-2xl",
            "bottom-0 left-0 border-b-[3.5px] border-l-[3.5px] rounded-bl-2xl",
            "bottom-0 right-0 border-b-[3.5px] border-r-[3.5px] rounded-br-2xl",
          ].map((c) => (
            <span key={c} className={`absolute w-10 h-10 border-brand-400 ${c}`} />
          ))}
        </motion.div>

        <div className="mt-7 flex flex-col items-center gap-2 text-center">
          <p className="flex items-center gap-2 text-[15px] font-semibold">
            <ScanLine size={17} className="text-brand-400" />
            {t("scan.hint")}
          </p>
          <p className="text-[11.5px] text-white/40 font-medium">{t("scan.demo")}</p>
        </div>

        <AnimatePresence mode="wait">
          {manual ? (
            <motion.div
              key="manual"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="mt-6 w-full max-w-[340px]"
            >
              <div
                className={`flex items-center gap-2 bg-white/8 border rounded-2xl h-14 pl-4 pr-1.5 backdrop-blur ${
                  err ? "border-danger" : "border-white/15 focus-within:border-brand-400"
                }`}
              >
                <input
                  value={code}
                  autoFocus
                  onChange={(e) => { setCode(e.target.value); setErr(false); }}
                  placeholder={t("scan.manualPh")}
                  className="flex-1 bg-transparent outline-none text-[14.5px] placeholder:text-white/35"
                />
                <Btn onClick={payManual} className="!w-auto !h-11 px-5 !rounded-xl text-[13.5px]" icon={SendHorizonal}>
                  {t("scan.pay")}
                </Btn>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="actions"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="mt-7 flex items-center gap-3"
            >
              <button
                onClick={() => setTorch((v) => !v)}
                className={`w-12 h-12 rounded-full border flex items-center justify-center transition-colors ${
                  torch ? "bg-brand-500 border-transparent" : "border-white/15 bg-white/8 hover:bg-white/15"
                }`}
                aria-label="Torch"
              >
                {torch ? <Flashlight size={20} /> : <FlashlightOff size={20} />}
              </button>
              <button
                onClick={() => setManual(true)}
                className="h-12 px-6 rounded-full bg-white text-[#0b1710] text-[14px] font-bold flex items-center gap-2 hover:bg-brand-50 transition-colors"
              >
                <Keyboard size={17} />
                {t("scan.manual")}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
