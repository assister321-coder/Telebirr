import {
  Bell,
  Globe,
  Headset,
  HelpCircle,
  Info,
  LockKeyhole,
  Moon,
  ShieldCheck,
  Sun,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import Header from "../components/Header";
import { Card, ListRow, Switch, cn } from "../components/primitives";
import { useApp } from "../store/AppContext";

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <p className="text-[12px] font-bold text-sub uppercase tracking-[0.1em] px-1 mb-2">{title}</p>
      <Card className="divide-y divide-line/70 py-1">{children}</Card>
    </div>
  );
}

function Seg<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string; icon?: LucideIcon }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex bg-soft rounded-full p-1 gap-0.5">
      {options.map((o) => {
        const active = o.value === value;
        const Icon = o.icon;
        return (
          <button
            key={o.value}
            onClick={() => onChange(o.value)}
            className={cn(
              "h-8 px-3 rounded-full text-[12px] font-bold flex items-center gap-1.5 transition-colors",
              active ? "bg-brand-500 text-white shadow-card" : "text-sub"
            )}
          >
            {Icon && <Icon size={13} />}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export default function Settings() {
  const { t, lang, setLang, theme, setTheme, notifOn, setNotifOn, toast } = useApp();
  const demo = () => toast(t("demo.feature"), false);

  return (
    <div className="min-h-full bg-bg">
      <Header title={t("nav.settings")} />
      <div className="px-4 lg:px-8 py-5 max-w-[640px] mx-auto space-y-6">
        <Group title={t("set.account")}>
          <ListRow icon={UserRound} title={t("prof.personal")} onClick={demo} />
          <ListRow icon={ShieldCheck} tint="#D98A00" title={t("prof.security")} onClick={demo} />
          <ListRow icon={LockKeyhole} tint="#7C5CE0" title={t("set.changePin")} onClick={demo} />
        </Group>

        <Group title={t("set.prefs")}>
          <ListRow
            icon={Globe}
            tint="#0E9488"
            title={t("set.language")}
            right={
              <Seg
                options={[
                  { value: "en", label: "English" },
                  { value: "am", label: "አማርኛ" },
                ]}
                value={lang}
                onChange={setLang}
              />
            }
          />
          <ListRow
            icon={Bell}
            tint="#C24E7E"
            title={t("prof.notifications")}
            sub={t("set.notifsSub")}
            right={<Switch on={notifOn} onChange={setNotifOn} />}
          />
          <ListRow
            icon={Moon}
            tint="#2B7CD3"
            title={t("set.theme")}
            right={
              <Seg
                options={[
                  { value: "light", label: t("set.light"), icon: Sun },
                  { value: "dark", label: t("set.dark"), icon: Moon },
                ]}
                value={theme}
                onChange={setTheme}
              />
            }
          />
        </Group>

        <Group title={t("set.support")}>
          <ListRow icon={HelpCircle} tint="#66806F" title={t("set.help")} onClick={demo} />
          <ListRow icon={Headset} tint="#66806F" title={t("set.contact")} onClick={demo} />
        </Group>

        <Group title={t("set.about")}>
          <ListRow
            icon={Info}
            tint="#66806F"
            title={t("set.version")}
            right={<span className="text-[13px] font-semibold text-sub">1.0.0 · demo</span>}
          />
        </Group>

        <p className="text-center text-[11px] text-sub/70 font-medium pb-2">{t("app.demoBadge")}</p>
      </div>
    </div>
  );
}
