import { AnimatePresence, motion } from "framer-motion";
import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import ConfirmSheet from "../components/ConfirmSheet";
import NumberPad from "../components/NumberPad";
import { SquareAvatar } from "../components/primitives";
import StatusBar from "../components/StatusBar";
import type { Contact } from "../data/mock";
import { totalWithFee } from "../lib/fees";
import { useApp } from "../store/AppContext";

export default function SendAmount() {
  const { t, navigate, back, balance, toast, commitTx } = useApp();
  const { route } = useApp();
  const contact = route.params?.contact as Contact | undefined;

  const [amount, setAmount] = useState("");
  const [noteOpen, setNoteOpen] = useState(false);
  const [note, setNote] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sending, setSending] = useState(false);

  /* Only redirect if THIS screen is the active route. While a page transition
     is animating, the exiting copy still renders against the new route and
     must not hijack navigation. */
  useEffect(() => {
    if (!contact && route.name === "sendAmount") back();
  }, [contact, back, route.name]);

  if (!contact) return null;

  const digit = (d: string) => {
    setAmount((a) => {
      if (a === "0") return d;
      const next = a + d;
      return /^\d{0,7}(\.\d{0,2})?$/.test(next) ? next : a;
    });
  };
  const dot = () => setAmount((a) => (a.includes(".") || a === "" ? (a === "" ? "0." : a) : a + "."));
  const backspace = () => setAmount((a) => a.slice(0, -1));

  const amt = parseFloat(amount || "0") || 0;
  const total = totalWithFee(amt);

  /** OK on the keypad opens the confirmation sheet */
  const submit = () => {
    if (!amt || amt <= 0) {
      toast(t("err.amount"), false);
      return;
    }
    if (total > balance) {
      toast(t("err.balance"), false);
      return;
    }
    setSheetOpen(true);
  };

  /** "Send" in the sheet commits the transaction and shows the receipt */
  const doSend = () => {
    setSending(true);
    window.setTimeout(() => {
      const flow = {
        type: "sent" as const,
        title: contact.name,
        phone: contact.phone,
        amount: amt,
        note: note || undefined,
      };
      const tx = commitTx(flow);
      setSending(false);
      setSheetOpen(false);
      navigate("success", { flow, tx });
    }, 1100);
  };

  return (
    <div className="min-h-full flex flex-col bg-page">
      <StatusBar />
      <Header title={t("send.title")} />

      <div className="px-5 pt-2 pb-4 max-w-[560px] w-full mx-auto flex items-center gap-3.5">
        <SquareAvatar size={52} />
        <div className="min-w-0">
          <p className="text-[18px] font-medium truncate leading-tight">{contact.name}</p>
          <p className="text-[13.5px] text-sub mt-0.5">{contact.phone.replace(/[+\s]/g, "")}</p>
        </div>
      </div>

      <div className="flex-1 bg-surface rounded-t-[22px] shadow-[0_-2px_16px_rgb(23_32_27/0.04)] max-w-[560px] w-full mx-auto flex flex-col">
        <div className="px-5 pt-5">
          <p className="text-[14px] text-ink mb-3">{t("send.amount")}</p>
          <div className="flex items-center border-b border-line pb-2.5">
            {/* blinking caret sits at the left edge, as on the device */}
            <motion.span
              animate={{ opacity: [1, 1, 0, 0] }}
              transition={{ duration: 1.1, repeat: Infinity, times: [0, 0.5, 0.5, 1] }}
              className="w-[3px] h-8 bg-[#8CC63F] rounded-full shrink-0"
            />
            <span className="flex-1 pl-2.5 text-[34px] font-extrabold tracking-tight tabular-nums leading-none min-h-[40px] flex items-center">
              {amount}
            </span>
            <span className="text-[14px] text-sub/60 shrink-0 border-l border-line pl-3.5">(ETB)</span>
          </div>

          <div className="mt-4">
            <AnimatePresence mode="wait">
              {noteOpen ? (
                <motion.div
                  key="input"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <input
                    autoFocus
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    onBlur={() => setNoteOpen(false)}
                    placeholder={t("send.notePh")}
                    className="flex-1 text-[13.5px] outline-none bg-transparent border-b border-line focus:border-brand-400 pb-1.5 placeholder:text-sub/50"
                  />
                </motion.div>
              ) : (
                <motion.button
                  key="link"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => setNoteOpen(true)}
                  className="flex items-center gap-1.5 text-[13.5px] font-medium text-[#2B7CD3]"
                >
                  <Pencil size={13} />
                  {note || t("send.addNotes")}
                </motion.button>
              )}
            </AnimatePresence>
          </div>

        </div>

        <div className="flex-1" />

        <NumberPad
          onDigit={digit}
          onDot={dot}
          onBackspace={backspace}
          onSubmit={submit}
          submitLabel="OK"
          submitEnabled={parseFloat(amount || "0") > 0}
        />
      </div>

      <ConfirmSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onSend={doSend}
        name={contact.name}
        amount={amt}
        sending={sending}
      />
    </div>
  );
}
