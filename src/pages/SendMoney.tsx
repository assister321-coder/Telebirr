import { motion } from "framer-motion";
import { ArrowLeftRight, ChevronRight, Contact, Trash2, UserRound } from "lucide-react";
import { useMemo, useState } from "react";
import Header from "../components/Header";
import { formatETPhone, validETPhone } from "../components/fields";
import { Btn, Modal, SquareAvatar, cn } from "../components/primitives";
import PromoCarousel from "../components/PromoCarousel";
import StatusBar from "../components/StatusBar";
import { CONTACTS } from "../data/mock";
import { useApp } from "../store/AppContext";

export default function SendMoney() {
  const { t, navigate, route, toast } = useApp();
  const prefill = route.params?.prefill as { name: string; phone: string } | undefined;

  const [phone, setPhone] = useState(prefill ? prefill.phone.replace(/\D/g, "").slice(-9) : "");
  const [cleared, setCleared] = useState(false);
  const valid = validETPhone(phone);

  // recipient-name prompt
  const [askName, setAskName] = useState(false);
  const [name, setName] = useState("");
  const [nameErr, setNameErr] = useState(false);
  const [pendingPhone, setPendingPhone] = useState("");

  const recent = useMemo(() => (cleared ? [] : CONTACTS.slice(0, 5)), [cleared]);

  const goToAmount = (contact: { name: string; phone: string }) => {
    navigate("sendAmount", { contact });
  };

  /** Always confirm who the money is going to before entering an amount. */
  const promptName = (digits: string, known?: string) => {
    const formatted = `+251 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
    setPendingPhone(formatted);
    setName(known ?? "");
    setNameErr(false);
    setAskName(true);
  };

  const onNext = () => {
    if (!valid) return;
    const match = CONTACTS.find((c) => c.phone.replace(/\D/g, "").endsWith(phone));
    promptName(phone, match?.name);
  };

  const confirmName = () => {
    const clean = name.trim();
    if (clean.length < 2) {
      setNameErr(true);
      return;
    }
    setAskName(false);
    goToAmount({ name: clean, phone: pendingPhone });
  };

  return (
    <div className="min-h-full flex flex-col bg-page">
      <StatusBar />
      <Header title={t("send.toIndividual")} />

      <div className="px-4 pt-3 max-w-[560px] w-full mx-auto">
        <PromoCarousel compact />
      </div>

      <div className="px-4 pt-4 max-w-[560px] w-full mx-auto">
        <div className="bg-surface rounded-[20px] shadow-card p-4">
          <p className="text-[14px] font-medium text-ink mb-3">{t("send.enterMobile")}</p>

          <div
            className={cn(
              "flex items-center gap-2 h-14 px-4 rounded-[14px] border-2 transition-colors",
              valid || phone === "" ? "border-brand-400" : "border-danger"
            )}
          >
            <span className="text-[15px] font-semibold text-ink shrink-0">+251</span>
            <input
              value={formatETPhone(phone)}
              autoFocus
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 9))}
              onKeyDown={(e) => e.key === "Enter" && onNext()}
              inputMode="tel"
              enterKeyHint="next"
              placeholder="9XX XXX XXX"
              className="flex-1 min-w-0 bg-transparent outline-none text-[15px] font-medium tracking-wide placeholder:text-sub/50"
            />
            <button
              onClick={() => toast(t("demo.feature"), false)}
              className="w-8 h-8 rounded-lg text-brand-500 hover:bg-soft flex items-center justify-center shrink-0"
              aria-label="Switch input mode"
            >
              <ArrowLeftRight size={17} />
            </button>
            <button
              onClick={() => toast(t("demo.feature"), false)}
              className="w-8 h-8 rounded-lg text-brand-500 hover:bg-soft flex items-center justify-center shrink-0"
              aria-label="Choose from contacts"
            >
              <Contact size={18} />
            </button>
          </div>

          <div className="mt-4">
            <Btn disabled={!valid} onClick={onNext} className="!bg-[#2F80ED] hover:!bg-[#2569c4]">
              {t("send.next")}
            </Btn>
          </div>

        </div>
      </div>

      <div className="px-4 pt-5 pb-6 max-w-[560px] w-full mx-auto flex-1">
        <div className="flex items-center justify-between px-1 mb-2">
          <p className="text-[15px] font-semibold">{t("send.recent")}</p>
          {recent.length > 0 && (
            <button
              onClick={() => setCleared(true)}
              className="w-8 h-8 rounded-lg hover:bg-soft flex items-center justify-center text-sub"
              aria-label="Clear recent"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>

        <div className="bg-surface rounded-[18px] shadow-card divide-y divide-line/70 overflow-hidden">
          {recent.length === 0 ? (
            <p className="text-center text-[13px] text-sub py-8">{t("tx.empty")}</p>
          ) : (
            recent.map((c, idx) => (
              <motion.button
                key={c.phone}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                onClick={() => promptName(c.phone.replace(/\D/g, "").slice(-9), c.name)}
                className="w-full flex items-center gap-3.5 px-4 py-3.5 text-left"
              >
                <SquareAvatar size={44} tone={idx % 2 === 0 ? "#F2A61B" : "#E38A2E"} />
                <span className="flex-1 min-w-0">
                  <span className="block text-[14.5px] font-bold tracking-wide uppercase truncate">
                    {c.name}
                  </span>
                  <span className="block text-[12px] text-sub mt-0.5">
                    {c.phone.replace(/[+\s]/g, "")}
                  </span>
                </span>
                <ChevronRight size={18} className="text-sub shrink-0" />
              </motion.button>
            ))
          )}
        </div>
      </div>

      {/* ── Recipient name prompt ─────────────────────────────────── */}
      <Modal open={askName} onClose={() => setAskName(false)}>
        <div className="text-center">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-[#F2A61B]/15 text-[#F2A61B] flex items-center justify-center">
            <UserRound size={26} />
          </div>
          <h3 className="mt-3.5 text-[17px] font-bold">{t("send.nameTitle")}</h3>
          <p className="mt-1 text-[12.5px] text-sub">{t("send.nameSub")}</p>
          <p className="mt-2 text-[13px] font-semibold tracking-wide text-brand-600">{pendingPhone}</p>
        </div>

        <div className="mt-4 text-left">
          <label className="block text-[12.5px] font-medium text-sub mb-1.5">
            {t("send.nameLabel")}
          </label>
          <input
            autoFocus
            value={name}
            onChange={(e) => { setName(e.target.value); setNameErr(false); }}
            onKeyDown={(e) => e.key === "Enter" && confirmName()}
            placeholder={t("send.namePh")}
            className={cn(
              "w-full h-[52px] px-4 rounded-[14px] border bg-surface text-[15px] outline-none transition-colors focus:ring-4",
              nameErr
                ? "border-danger focus:ring-danger/10"
                : "border-line focus:border-brand-400 focus:ring-brand-500/10"
            )}
          />
          {nameErr && <p className="mt-1.5 text-[12px] text-danger font-medium">{t("err.name")}</p>}
        </div>

        <div className="mt-4 flex gap-2.5">
          <Btn variant="secondary" onClick={() => setAskName(false)} className="flex-1">
            {t("common.cancel")}
          </Btn>
          <Btn onClick={confirmName} className="flex-[1.4]">
            {t("common.continue")}
          </Btn>
        </div>
      </Modal>
    </div>
  );
}
