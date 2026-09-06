import { Search, SearchX } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Header from "../components/Header";
import { Card, Empty, cn } from "../components/primitives";
import TxRow from "../components/TxRow";
import { groupByDay } from "../lib/format";
import { useApp } from "../store/AppContext";

let txsLoaded = false;

const FILTERS = ["all", "sent", "received", "bills"] as const;
type Filter = (typeof FILTERS)[number];

export default function Transactions() {
  const { t, txs, navigate, txSub } = useApp();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [loaded, setLoaded] = useState(txsLoaded);

  useEffect(() => {
    if (txsLoaded) return;
    const id = window.setTimeout(() => {
      txsLoaded = true;
      setLoaded(true);
    }, 600);
    return () => window.clearTimeout(id);
  }, []);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return txs.filter((tx) => {
      if (filter === "sent" && tx.amount >= 0) return false;
      if (filter === "received" && tx.amount <= 0) return false;
      if (filter === "bills" && !(tx.kind === "bill" || tx.kind === "airtime")) return false;
      if (query) {
        const hay = `${tx.title} ${txSub(tx)} ${tx.id} ${tx.note ?? ""}`.toLowerCase();
        if (!hay.includes(query)) return false;
      }
      return true;
    });
  }, [txs, q, filter, txSub]);

  const groups = useMemo(() => groupByDay(filtered, t), [filtered, t]);

  return (
    <div className="min-h-full bg-bg">
      <Header title={t("tx.title")} plain />

      <div className="px-4 lg:px-8 pt-4 max-w-[640px] mx-auto space-y-4">
        {/* search */}
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-sub pointer-events-none" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("tx.search")}
            className="w-full h-12 pl-11 pr-4 rounded-2xl bg-surface border border-line text-[14px] placeholder:text-sub/60 outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-500/10 transition-colors shadow-card"
          />
        </div>

        {/* filters */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "h-9 px-4 rounded-full text-[13px] font-semibold whitespace-nowrap border transition-colors",
                filter === f
                  ? "bg-brand-500 text-white border-transparent shadow-[0_6px_14px_rgb(22_138_69/0.25)]"
                  : "bg-surface border-line text-sub hover:text-ink"
              )}
            >
              {t(`flt.${f}`)}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 lg:px-8 pb-6 pt-1 max-w-[640px] mx-auto">
        {!loaded ? (
          <div className="space-y-2 animate-pulse">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="h-[70px] rounded-2xl shimmer" />
            ))}
          </div>
        ) : groups.length === 0 ? (
          <Empty icon={SearchX} title={t("tx.empty")} sub={t("tx.emptySub")} />
        ) : (
          groups.map((g) => (
            <div key={g.label}>
              <p className="px-1 pt-4 pb-2 text-[12px] font-semibold text-sub uppercase tracking-[0.08em]">
                {g.label}
              </p>
              <Card className="py-1.5 divide-y divide-line/70">
                {g.items.map((tx) => (
                  <TxRow key={tx.id} tx={tx} onClick={() => navigate("txdetail", { tx })} />
                ))}
              </Card>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
