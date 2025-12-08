import { TrendingDown } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

const cryptoData = [
  { symbol: "BTC", name: "BTC", price: "24,300.40", change: "-3.31%", icon: "₿" },
  { symbol: "ETH", name: "BTC", price: "24,300.40", change: "-3.31%", icon: "◆" },
  { symbol: "SOL", name: "BTC", price: "24,300.40", change: "-3.31%", icon: "◎" },
];

const chartData = [
  { time: "08:00AM", value: 31500 },
  { time: "09:00AM", value: 34600 },
  { time: "10:00AM", value: 30400 },
  { time: "11:00AM", value: 28200 },
  { time: "12:00PM", value: 42500 },
];

export const Markets = () => {
  return (
    <section className="px-6 py-8 bg-background">
      <h2 className="text-lg font-semibold mb-6">Markets</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hot Crypto Tables */}
        {[0, 1].map((tableIdx) => (
          <div key={tableIdx} className="bg-card rounded-lg p-4 border border-border">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium">Hot crypto</span>
              <span className="text-xs text-muted-foreground">USD</span>
            </div>
            <div className="space-y-3">
              {cryptoData.map((crypto, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs">
                      {crypto.icon}
                    </span>
                    <span className="text-sm font-medium">{crypto.symbol}</span>
                    <span className="text-xs text-muted-foreground">/USD</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm">{crypto.price}</span>
                    <span className="text-destructive text-xs font-mono flex items-center gap-1">
                      {crypto.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Price Chart */}
        <div className="bg-card rounded-lg p-4 border border-border">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xl font-bold font-mono">$42,569.43</span>
              <span className="ml-2 text-xs text-success">+5.8</span>
            </div>
          </div>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(250, 60%, 50%)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="hsl(174, 72%, 56%)" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="time"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: 'hsl(0, 0%, 60%)' }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: 'hsl(0, 0%, 60%)' }}
                  tickFormatter={(val) => `$${(val / 1000).toFixed(1)}K`}
                  domain={['dataMin - 5000', 'dataMax + 5000']}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(0, 0%, 5%)',
                    border: '1px solid hsl(0, 0%, 18%)',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Value']}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(174, 72%, 56%)"
                  strokeWidth={2}
                  fill="url(#chartGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>USD</span>
          </div>
        </div>
      </div>
    </section>
  );
};
