import { useEffect, useMemo, useState } from "react";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { BASE_URL } from "@/services/api";
import { TradingViewWidget } from "./TradingViewWidget";

type MarketRow = {
  symbol: string;
  price: number;
  change24h: number;
  icon: string;
};

type Point = { time: string; value: number };

type MarketsResponse = { rows: MarketRow[]; source?: string };
type ChartResponse = { series: Point[]; source?: string };

const fetchMarkets = async (): Promise<MarketsResponse> => {
  const res = await fetch(`${BASE_URL}/api/markets/prices`);
  if (!res.ok) throw new Error("Failed to load prices");
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Failed to load prices");
  return { rows: data.rows as MarketRow[], source: data.source };
};

const fetchEthSeries = async (): Promise<ChartResponse> => {
  const res = await fetch(`${BASE_URL}/api/markets/eth-chart`);
  if (!res.ok) throw new Error("Failed to load ETH chart");
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Failed to load ETH chart");
  return { series: data.series as Point[], source: data.source };
};

const COIN_STYLES: Record<string, { bg: string; text: string }> = {
  ETH: { bg: "bg-blue-500/15 text-blue-200", text: "text-blue-100" },
  AVAX: { bg: "bg-red-500/15 text-red-200", text: "text-red-100" },
  BTC: { bg: "bg-amber-500/20 text-amber-200", text: "text-amber-100" },
};

const CoinBadge = ({ symbol, icon }: { symbol: string; icon: string }) => {
  const style = COIN_STYLES[symbol] || { bg: "bg-primary/15 text-primary", text: "text-primary" };
  return (
    <span className={`w-7 h-7 rounded-full ${style.bg} flex items-center justify-center text-xs font-semibold ${style.text}`}>
      {icon}
    </span>
  );
};

export const Markets = () => {
  const [rows, setRows] = useState<MarketRow[]>([]);
  const [series, setSeries] = useState<Point[]>([]);
  const [pricesSource, setPricesSource] = useState<string | undefined>(undefined);
  const [chartSource, setChartSource] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [m, s] = await Promise.all([fetchMarkets(), fetchEthSeries()]);
        setRows(m.rows);
        setSeries(s.series);
        setPricesSource(m.source);
        setChartSource(s.source);
      } catch (err: any) {
        setError(err?.message || "Failed to load markets");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const latestEth = useMemo(() => series[series.length - 1]?.value, [series]);
  const ethChange = rows.find((r) => r.symbol === "ETH")?.change24h;
  const chartSourceLabel = "TradingView";

  return (
    <section className="px-6 py-8 bg-background">
      <h2 className="text-lg font-semibold mb-6">Markets (live)</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live crypto list */}
        <div className="bg-card rounded-lg p-4 border border-border lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium">Hot crypto</span>
            <span className="text-xs text-muted-foreground">USD</span>
          </div>
          {loading && <div className="text-xs text-muted-foreground">Loading…</div>}
          {error && <div className="text-xs text-destructive">{error}</div>}
          {!loading && !error && rows.length === 0 && (
            <div className="text-xs text-muted-foreground">No market data available.</div>
          )}
          {!loading && !error && rows.length > 0 && (
            <div className="space-y-3">
              {rows.map((row) => {
                const down = row.change24h < 0;
                const change = `${down ? "" : "+"}${row.change24h.toFixed(2)}%`;
                return (
                  <div key={row.symbol} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CoinBadge symbol={row.symbol} icon={row.icon} />
                      <span className="text-sm font-medium">{row.symbol}</span>
                      <span className="text-xs text-muted-foreground">/USD</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm">${row.price.toLocaleString()}</span>
                      <span className={`${down ? "text-destructive" : "text-green-500"} text-xs font-mono`}>
                        {change}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ETH chart */}
        <div className="bg-card rounded-lg p-4 border border-border lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xl font-bold font-mono">{latestEth ? `$${latestEth.toLocaleString()}` : "--"}</span>
              {ethChange !== undefined && (
                <span className={`ml-2 text-xs ${ethChange >= 0 ? "text-green-500" : "text-destructive"}`}>
                  {ethChange >= 0 ? "+" : ""}{ethChange.toFixed(2)}%
                </span>
              )}
            </div>
            <span className="text-xs text-muted-foreground">
              ETH / USD ({chartSourceLabel})
            </span>
          </div>
          <div className="h-[360px]">
            <TradingViewWidget
              symbol="BINANCE:ETHUSD"
              title={undefined}
              plain
              className="h-full"
              height={360}
              hideVolume
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>24h (hourly)</span>
            <span>Source: {chartSourceLabel}</span>
          </div>
        </div>
      </div>

      {/* TradingView live pairs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
        <TradingViewWidget symbol="BINANCE:AVAXUSDT" title="AVAX / USDT" />
        <TradingViewWidget symbol="BINANCE:ETHUSDT" title="ETH / USDT" />
      </div>
    </section>
  );
};
