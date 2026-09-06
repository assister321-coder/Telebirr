import {
  Bike,
  Building2,
  HandCoins,
  Plane,
  ShieldPlus,
  ShoppingBag,
  Soup,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import Header from "../components/Header";
import { Card } from "../components/primitives";
import { useApp } from "../store/AppContext";

const TILES: { key: string; icon: LucideIcon; fg: string; bg: string }[] = [
  { key: "ride", icon: Bike, fg: "#2B7CD3", bg: "rgba(43,124,211,0.11)" },
  { key: "shop", icon: ShoppingBag, fg: "#C24E7E", bg: "rgba(194,78,126,0.11)" },
  { key: "food", icon: Soup, fg: "#D98A00", bg: "rgba(217,138,0,0.12)" },
  { key: "travel", icon: Plane, fg: "#0E9488", bg: "rgba(14,148,136,0.12)" },
  { key: "insure", icon: ShieldPlus, fg: "#7C5CE0", bg: "rgba(124,92,224,0.11)" },
  { key: "loans", icon: HandCoins, fg: "#168A45", bg: "rgba(22,138,69,0.11)" },
  { key: "gov", icon: Building2, fg: "#B8541D", bg: "rgba(184,84,29,0.11)" },
];

export default function Apps() {
  const { t, toast } = useApp();
  return (
    <div className="min-h-full bg-bg">
      <Header title={t("apps.title")} plain />
      <div className="px-4 lg:px-8 py-5 max-w-[640px] mx-auto">
        <p className="text-[13px] text-sub px-1 mb-4">{t("apps.sub")}</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {TILES.map((tl) => {
            const Icon = tl.icon;
            return (
              <Card key={tl.key} onClick={() => toast(t("demo.feature"), false)} className="p-4">
                <div className="flex flex-col items-start gap-3">
                  <span
                    className="w-11 h-11 rounded-2xl flex items-center justify-center"
                    style={{ background: tl.bg, color: tl.fg }}
                  >
                    <Icon size={21} strokeWidth={2.1} />
                  </span>
                  <span className="text-[13.5px] font-semibold leading-tight">{t(`apps.${tl.key}`)}</span>
                </div>
              </Card>
            );
          })}
          <div className="rounded-[20px] border border-dashed border-line flex flex-col items-center justify-center gap-2 p-4 text-sub">
            <Sparkles size={20} />
            <span className="text-[12px] font-medium text-center">{t("apps.more")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
