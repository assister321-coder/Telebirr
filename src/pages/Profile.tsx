import { motion } from "framer-motion";
import {
  Bell,
  Download,
  Globe,
  HelpCircle,
  Info,
  LogOut,
  Pencil,
  ShieldCheck,
  UserRound,
  Users,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import Header from "../components/Header";
import { Avatar, Btn, Card, ListRow, Modal } from "../components/primitives";
import { useApp } from "../store/AppContext";

export default function Profile() {
  const { t, user, navigate, resetTo, toast } = useApp();
  const [confirmOut, setConfirmOut] = useState(false);

  const demo = () => toast(t("demo.feature"), false);

  return (
    <div className="min-h-full bg-bg">
      <Header title={t("nav.profile")} plain />
      <div className="px-4 lg:px-8 py-5 max-w-[640px] mx-auto space-y-5">
        {/* identity card */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <Card className="relative overflow-visible px-5 pt-7 pb-5 flex flex-col items-center text-center">
            <div className="relative">
              <Avatar name={user.name} src="/avatar.jpg" size={84} className="ring-4 ring-soft" />
              <button
                onClick={demo}
                className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-brand-500 text-white border-[3px] border-surface flex items-center justify-center shadow-card"
                aria-label={t("prof.edit")}
              >
                <Pencil size={13} />
              </button>
            </div>
            <h2 className="mt-3.5 text-[19px] font-extrabold tracking-tight">{user.name}</h2>
            <p className="text-[13.5px] text-sub mt-0.5">{user.phone}</p>
            <span className="mt-3 inline-flex items-center gap-1.5 bg-soft text-brand-700 dark:text-brand-300 text-[11.5px] font-bold px-3 py-1.5 rounded-full border border-brand-100">
              <ShieldCheck size={13} />
              {t("prof.tier")}
            </span>
          </Card>
        </motion.div>

        {/* menu */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.4 }}
        >
          <Card className="divide-y divide-line/70 py-1">
            <ListRow icon={UserRound} title={t("prof.personal")} sub={`${user.name} · ${user.phone}`} onClick={demo} />
            <ListRow icon={ShieldCheck} tint="#D98A00" title={t("prof.security")} sub="PIN · OTP" onClick={demo} />
            <ListRow icon={Wallet} tint="#2B7CD3" title={t("prof.linked")} sub="CBE •**1130 · Awash •**8842" onClick={demo} />
            <ListRow icon={Users} tint="#7C5CE0" title={t("prof.beneficiaries")} onClick={() => navigate("payments")} />
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14, duration: 0.4 }}
        >
          <Card className="divide-y divide-line/70 py-1">
            <ListRow icon={Globe} tint="#0E9488" title={t("prof.language")} onClick={() => navigate("settings")} />
            <ListRow icon={Bell} tint="#C24E7E" title={t("prof.notifications")} onClick={() => navigate("settings")} />
            <ListRow icon={HelpCircle} tint="#66806F" title={t("prof.help")} onClick={demo} />
            <ListRow icon={Info} tint="#66806F" title={t("prof.about")} onClick={() => navigate("settings")} />
          </Card>
        </motion.div>

        {/* Download App */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <Card className="px-5 py-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gradient-to-br from-brand-400 via-brand-500 to-brand-700 flex items-center justify-center shadow-card">
                <img
                  src="https://images.sftcdn.net/images/t_app-icon-s/p/6ef58b81-d4cb-4309-b7d9-0228be98241e/2673368560/telebirr-logo"
                  alt="telebirr"
                  className="w-10 h-10 object-contain"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-bold">{t("app.name")}</p>
                <p className="text-[12px] text-sub mt-0.5">v1.0.0 · Demo</p>
              </div>
            </div>
            <p className="text-[13px] text-sub mt-3 leading-relaxed">
              {t("download.desc")}
            </p>
            <Btn
              variant="primary"
              icon={Download}
              className="mt-4"
              onClick={() => {
                const link = document.createElement('a');
                link.href = '/telebirr-app.html';
                link.download = 'telebirr-app.html';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                toast(t("download.start"), true);
              }}
            >
              {t("download.btn")}
            </Btn>
            <p className="text-[11px] text-sub/60 mt-2.5 text-center">
              {t("download.note")}
            </p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
        >
          <Card className="py-1">
            <ListRow icon={LogOut} danger title={t("prof.signOut")} right={<span />} onClick={() => setConfirmOut(true)} />
          </Card>
        </motion.div>
      </div>

      <Modal open={confirmOut} onClose={() => setConfirmOut(false)}>
        <div className="text-center">
          <div className="mx-auto w-14 h-14 rounded-full bg-danger/10 text-danger flex items-center justify-center">
            <LogOut size={24} />
          </div>
          <h3 className="mt-4 text-[17px] font-bold">{t("prof.signOutQ")}</h3>
          <p className="mt-1.5 text-[13px] text-sub">{t("prof.signOutSub")}</p>
          <div className="mt-5 space-y-2.5">
            <Btn variant="danger" onClick={() => { setConfirmOut(false); resetTo("login"); }}>
              {t("prof.signOut")}
            </Btn>
            <Btn variant="secondary" onClick={() => setConfirmOut(false)}>
              {t("common.cancel")}
            </Btn>
          </div>
        </div>
      </Modal>
    </div>
  );
}
