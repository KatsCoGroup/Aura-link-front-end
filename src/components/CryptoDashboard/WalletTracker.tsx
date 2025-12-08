import { useMemo } from "react";

interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
  type: "primary" | "secondary" | "tertiary";
}

interface Edge {
  from: string;
  to: string;
  value?: string;
}

export const WalletTracker = () => {
  const nodes: Node[] = useMemo(() => [
    { id: "1", label: "0x0000...0000", x: 50, y: 50, type: "primary" },
    { id: "2", label: "0xaa82a9x1177", x: 25, y: 35, type: "secondary" },
    { id: "3", label: "0x31439e0210", x: 65, y: 25, type: "secondary" },
    { id: "4", label: "0x225f9e8be", x: 20, y: 55, type: "tertiary" },
    { id: "5", label: "0x0000008c41", x: 15, y: 70, type: "secondary" },
    { id: "6", label: "0x41fBe1fc34", x: 30, y: 80, type: "tertiary" },
    { id: "7", label: "0x7d25a25d22", x: 55, y: 85, type: "secondary" },
    { id: "8", label: "0xec504.93a4", x: 70, y: 75, type: "tertiary" },
    { id: "9", label: "0x10f30h45d", x: 75, y: 40, type: "secondary" },
    { id: "10", label: "0x110dc1dae2", x: 85, y: 50, type: "tertiary" },
    { id: "11", label: "0x0e0b4c1db8", x: 80, y: 65, type: "secondary" },
    { id: "12", label: "0x60b04c4d55", x: 90, y: 35, type: "tertiary" },
    { id: "13", label: "Router 2_UniV3ap_Router", x: 35, y: 90, type: "tertiary" },
  ], []);

  const edges: Edge[] = useMemo(() => [
    { from: "1", to: "2", value: "0.0198 ETH" },
    { from: "1", to: "3" },
    { from: "1", to: "4" },
    { from: "1", to: "5" },
    { from: "1", to: "6" },
    { from: "1", to: "7" },
    { from: "1", to: "9" },
    { from: "3", to: "10" },
    { from: "9", to: "12" },
    { from: "7", to: "8" },
    { from: "6", to: "13" },
    { from: "11", to: "1" },
  ], []);

  return (
    <section className="px-6 py-8 bg-card mx-6 mb-6 rounded-xl border border-border">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold">Wallet tracker</h2>
          <p className="text-sm text-muted-foreground">crypto wallet</p>
        </div>
        <div className="flex items-center gap-8 text-sm">
          <span className="font-medium">Peer To Peer</span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-muted-foreground">Inbound</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-destructive" />
              <span className="text-muted-foreground">Outbound</span>
            </div>
          </div>
        </div>
      </div>

      {/* Network Graph */}
      <div className="relative h-80 overflow-hidden rounded-lg">
        <svg className="w-full h-full">
          {/* Edges */}
          {edges.map((edge, i) => {
            const fromNode = nodes.find((n) => n.id === edge.from);
            const toNode = nodes.find((n) => n.id === edge.to);
            if (!fromNode || !toNode) return null;
            return (
              <g key={i}>
                <line
                  x1={`${fromNode.x}%`}
                  y1={`${fromNode.y}%`}
                  x2={`${toNode.x}%`}
                  y2={`${toNode.y}%`}
                  stroke="hsl(0, 0%, 30%)"
                  strokeWidth="1"
                  strokeDasharray="4 2"
                />
                {edge.value && (
                  <text
                    x={`${(fromNode.x + toNode.x) / 2}%`}
                    y={`${(fromNode.y + toNode.y) / 2}%`}
                    fill="hsl(174, 72%, 56%)"
                    fontSize="8"
                    textAnchor="middle"
                  >
                    {edge.value}
                  </text>
                )}
              </g>
            );
          })}

          {/* Nodes */}
          {nodes.map((node) => (
            <g key={node.id} className="cursor-pointer">
              <circle
                cx={`${node.x}%`}
                cy={`${node.y}%`}
                r={node.type === "primary" ? 20 : node.type === "secondary" ? 14 : 10}
                fill={
                  node.type === "primary"
                    ? "hsl(35, 90%, 55%)"
                    : node.type === "secondary"
                    ? "hsl(35, 80%, 60%)"
                    : "hsl(174, 72%, 56%)"
                }
                className="transition-all hover:opacity-80"
              />
              {node.type === "primary" && (
                <text
                  x={`${node.x}%`}
                  y={`${node.y}%`}
                  fill="hsl(0, 0%, 0%)"
                  fontSize="8"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  ⚙
                </text>
              )}
              <text
                x={`${node.x}%`}
                y={`${node.y + (node.type === "primary" ? 8 : 6)}%`}
                fill="hsl(0, 0%, 60%)"
                fontSize="7"
                textAnchor="middle"
              >
                {node.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </section>
  );
};
