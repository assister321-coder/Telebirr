import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Delete, X } from "lucide-react";
import { useState } from "react";
import { validETPhone } from "../components/fields";
import { Btn, EthioTelecomLogo, TelebirrLogo } from "../components/primitives";
import StatusBar from "../components/StatusBar";
import { useApp } from "../store/AppContext";

export const DEMO_PIN = "797970";

function PinScreen({
  pin,
  onChange,
  onClose,
  onSubmit,
  forgot,
}: {
  pin: string;
  onChange: (value: string) => void;
  onClose: () => void;
  onSubmit: (value?: string) => void;
  forgot: () => void;
}) {
  const press = (value: string) => {
    if (pin.length < 6) {
      const next = `${pin}${value}`;
      onChange(next);
      if (next.length === 6) window.setTimeout(() => onSubmit(next), 120);
    }
  };

  return (
    <div className="h-dvh min-h-full overflow-y-auto bg-white text-[#24352b] flex flex-col relative">
      <button
        onClick={onClose}
        className="absolute left-4 xs:left-7 top-4 xs:top-5 w-9 h-9 flex items-center justify-center"
        aria-label="Close"
      >
        <X size={24} strokeWidth={1.5} />
      </button>

      <div className="pt-[76px] xs:pt-[92px] text-center px-4">
        <h1 className="text-[24px] xs:text-[27px] font-normal tracking-tight">Enter PIN</h1>
        <div className="mt-6 xs:mt-7 flex justify-center gap-3 xs:gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <span
              key={index}
              className={`w-[16px] h-[16px] xs:w-[18px] xs:h-[18px] rounded-full border ${
                index < pin.length ? "border-[#24352b] bg-[#24352b]" : "border-[#dfe5dc]"
              }`}
            />
          ))}
        </div>
        <button onClick={forgot} className="mt-6 xs:mt-7 text-[15px] xs:text-[17px] font-semibold">
          Forgot PIN
        </button>
      </div>

      <div className="mt-auto pb-[42px] xs:pb-[72px] px-10 xs:px-14">
        <div className="grid grid-cols-3 gap-y-8 xs:gap-y-12 text-center">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((value) => (
            <button key={value} onClick={() => press(value)} className="text-[27px] xs:text-[30px] font-normal h-10">
              {value}
            </button>
          ))}
          <span />
          <button onClick={() => press("0")} className="text-[27px] xs:text-[30px] font-normal h-10">0</button>
          <button
            onClick={() => onChange(pin.slice(0, -1))}
            className="h-10 flex items-center justify-center"
            aria-label="Delete PIN digit"
          >
            <Delete size={26} className="xs:w-[30px] xs:h-[30px]" strokeWidth={1.3} />
          </button>
        </div>
      </div>

      <button
        onClick={onSubmit}
        disabled={pin.length !== 6}
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      />
    </div>
  );
}

function WaveBg() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.55]"
      viewBox="0 0 400 800"
      preserveAspectRatio="none"
      fill="none"
    >
      <path d="M-20 90 Q100 40 200 90 T420 90" stroke="#CFE4D6" strokeWidth="2" />
      <path d="M-20 130 Q100 80 200 130 T420 130" stroke="#DCEEE1" strokeWidth="2" />
      <path d="M-20 700 Q120 650 220 700 T420 700" stroke="#DCEEE1" strokeWidth="2" />
      <path d="M-20 740 Q120 690 220 740 T420 740" stroke="#CFE4D6" strokeWidth="2" />
      <path d="M-20 770 Q120 730 220 770 T420 770" stroke="#E7F2EA" strokeWidth="2" />
    </svg>
  );
}

export default function Login() {
  const { login, t, lang, setLang } = useApp();
  const [step, setStep] = useState<"phone" | "pin">("phone");
  const [langOpen, setLangOpen] = useState(false);
  const [phone, setPhone] = useState("956797970");
  const [pin, setPin] = useState("");
  const [errPhone, setErrPhone] = useState<string | null>(null);
  const [errPin, setErrPin] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const phoneValid = validETPhone(phone);

  const next = () => {
    if (!phoneValid) {
      setErrPhone(t("err.phone"));
      return;
    }
    setStep("pin");
  };

  const submitPin = (value = pin) => {
    if (value.length !== 6) {
      setErrPin(t("err.pin"));
      return;
    }
    if (value !== DEMO_PIN) {
      setErrPin(t("err.pinWrong"));
      setPin("");
      return;
    }
    setLoading(true);
    window.setTimeout(
      () => login(`+251 ${phone.slice(0, 3)} ${phone.slice(3, 6)} ${phone.slice(6)}`),
      900
    );
  };

  if (step === "pin") {
    return (
      <PinScreen
        pin={pin}
        onChange={(value) => { setPin(value); setErrPin(null); }}
        onClose={() => { setPin(""); setStep("phone"); }}
        onSubmit={submitPin}
        forgot={() => undefined}
      />
    );
  }

  return (
    <div className="min-h-full min-h-dvh relative overflow-y-auto bg-white flex flex-col">
      <WaveBg />

      {/* phone status bar with real clock */}
      <div className="relative bg-white/70">
        <StatusBar />
      </div>

      {/* brand app bar */}
      <div className="relative flex min-h-[56px] items-center justify-between gap-3 px-3 xs:px-4 py-2.5 bg-white border-b border-line/60 overflow-hidden">
        <EthioTelecomLogo scale={0.95} />
        <TelebirrLogo scale={0.95} />
      </div>

      <div className="relative max-w-[440px] w-full mx-auto flex-1 flex flex-col px-4 xs:px-5 sm:px-6">
        {/* language selector */}
        <div className="flex items-center justify-end pt-4">
          <div className="relative">
            <button
              onClick={() => setLangOpen((v) => !v)}
              className="flex items-center gap-1 text-[13.5px] font-medium text-ink"
            >
              {lang === "en" ? "English" : "አማርኛ"}
              <ChevronDown size={15} />
            </button>
            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.97 }}
                  className="absolute right-0 top-7 z-10 bg-surface border border-line rounded-xl shadow-pop overflow-hidden w-32"
                >
                  {(["en", "am"] as const).map((l) => (
                    <button
                      key={l}
                      onClick={() => { setLang(l); setLangOpen(false); }}
                      className={`w-full text-left px-3.5 py-2.5 text-[13px] font-medium hover:bg-soft ${
                        lang === l ? "text-brand-600 font-semibold" : "text-ink"
                      }`}
                    >
                      {l === "en" ? "English" : "አማርኛ"}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* headline block */}
        <div className="mt-7 xs:mt-10 sm:mt-14 text-center">
          <AnimatePresence mode="wait">
            {step === "phone" ? (
              <motion.div key="h1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <p className="text-[18px] xs:text-[20px] font-extrabold text-[#2B7CD3] leading-snug">
                  {t("login.step1Title1")}
                </p>
                <p className="text-[16px] xs:text-[18px] font-bold text-[#2B7CD3] mt-1">{t("login.step1Title2")}</p>
                <p className="text-[24px] xs:text-[26px] font-extrabold text-ink mt-1">{t("login.step1Title3")}</p>
                <span className="block w-10 h-[3px] bg-brand-500 rounded-full mx-auto mt-2" />
              </motion.div>
            ) : (
              <motion.div key="h2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <p className="text-[22px] font-extrabold text-ink">{t("login.enterPin")}</p>
                <p className="text-[13.5px] text-sub mt-1.5">
                  {t("login.pinSub")} +251 {phone.slice(0, 3)} {phone.slice(3, 6)} {phone.slice(6)}
                </p>
                <span className="block w-10 h-[3px] bg-brand-500 rounded-full mx-auto mt-2" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* form */}
        <div className="mt-7 xs:mt-9">
          <AnimatePresence mode="wait">
            {step === "phone" ? (
              <motion.div key="phone" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.3 }}>
                <p className="text-[14px] text-sub font-medium mb-2">{t("login.mobileNumber")}</p>
                <div
                    className={`flex items-center gap-2.5 h-[54px] px-4 rounded-[10px] border bg-white ${
                    errPhone ? "border-danger" : "border-line"
                  }`}
                >
                  <span className="text-[15px] font-medium text-ink shrink-0">+251</span>
                  <span className="w-px h-6 bg-line shrink-0" />
                  <input
                    value={phone.replace(/(\d{3})(\d{0,3})(\d{0,3})/, (_, a, b, c) => [a, b, c].filter(Boolean).join(" "))}
                    onChange={(e) => { setPhone(e.target.value.replace(/\D/g, "").slice(0, 9)); setErrPhone(null); }}
                    inputMode="tel"
                    placeholder="9XX XXX XXX"
                    className="flex-1 min-w-0 bg-transparent outline-none text-[15px] tracking-wide placeholder:text-sub/50"
                  />
                </div>
                {errPhone && <p className="mt-2 text-[12.5px] text-danger font-medium">{errPhone}</p>}

                <div className="mt-6">
                  <Btn onClick={next} className="!h-[54px] !bg-[#2F80ED] hover:!bg-[#2569c4]">
                    {t("login.next")}
                  </Btn>
                </div>

                <p className="text-center text-[13px] text-sub mt-5">
                  {t("login.noAccount")}{" "}
                  <button className="font-semibold text-brand-500">{t("login.createNew")}</button>
                </p>

                <div className="flex items-center justify-center gap-10 mt-5">
                  <button className="text-[13.5px] font-semibold text-brand-500">{t("login.hub")}</button>
                  <button className="text-[13.5px] font-semibold text-brand-500">{t("login.help")}</button>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        <div className="flex-1" />

        <div className="text-center pb-6 pt-8">
          <button className="text-[12.5px] font-semibold text-brand-600">{t("login.terms")}</button>
          <p className="text-[10.5px] text-sub/70 mt-3">{t("login.copyright")}</p>
          <p className="text-[10.5px] text-sub/50 mt-0.5">{t("login.version")}</p>
        </div>
      </div>
    </div>
  );
}
