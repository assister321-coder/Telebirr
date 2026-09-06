import { motion } from "framer-motion";
import { Copy, HandCoins, Share2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import Header from "../components/Header";
import { Btn, Card } from "../components/primitives";
import { useApp } from "../store/AppContext";

export default function Receive() {
  const { t, user, toast } = useApp();
  const payload = `tebipay://pay?wallet=${encodeURIComponent(user.phone)}&name=${encodeURIComponent(user.name)}&demo=1`;

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* clipboard unavailable — still show demo toast */
    }
    toast(t("common.copied"));
  };

  return (
    <div className="min-h-full flex flex-col bg-bg">
      <Header title={t("recv.title")} />
      <div className="flex-1 px-4 lg:px-8 py-5 max-w-[560px] w-full mx-auto flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="px-4 py-3.5 flex items-center justify-between">
            <div>
              <p className="text-[12px] text-sub font-medium">{t("recv.yourWallet")}</p>
              <p className="text-[16px] font-bold tracking-wide mt-0.5">{user.phone}</p>
            </div>
            <button
              onClick={() => copy(user.phone)}
              className="w-10 h-10 rounded-xl bg-soft text-brand-600 flex items-center justify-center hover:bg-brand-100 transition-colors"
              aria-label={t("recv.copy")}
            >
              <Copy size={17} />
            </button>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 flex flex-col items-center"
        >
          <div className="relative bg-white rounded-[28px] p-6 shadow-pop ring-1 ring-line">
            {/* corner accents */}
            {["top-3 left-3 border-t-4 border-l-4 rounded-tl-xl", "top-3 right-3 border-t-4 border-r-4 rounded-tr-xl", "bottom-3 left-3 border-b-4 border-l-4 rounded-bl-xl", "bottom-3 right-3 border-b-4 border-r-4 rounded-br-xl"].map(
              (c) => (
                <span key={c} className={`absolute w-7 h-7 border-brand-500 ${c}`} />
              )
            )}
            <QRCodeSVG
              value={payload}
              size={196}
              fgColor="#08411F"
              bgColor="#FFFFFF"
              level="M"
            />
          </div>
          <p className="mt-5 text-[13.5px] text-sub font-medium text-center max-w-[240px]">
            {t("recv.scanMe")}
          </p>
        </motion.div>

        <div className="flex-1" />

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22, duration: 0.4 }}
          className="flex gap-3 pt-6"
        >
          <Btn variant="secondary" icon={HandCoins} onClick={() => toast(t("demo.feature"), false)}>
            {t("recv.request")}
          </Btn>
          <Btn icon={Share2} onClick={() => copy(payload)}>
            {t("common.share")}
          </Btn>
        </motion.div>
      </div>
    </div>
  );
}
