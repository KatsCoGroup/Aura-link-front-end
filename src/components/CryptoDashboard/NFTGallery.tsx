import { useState } from "react";
import { cn } from "@/lib/utils";
import { TrendingUp } from "lucide-react";

const categories = [
  { id: "kaiso", name: "KAISO NFTS", count: "0/0" },
  { id: "opensea", name: "OPENSEA NFTS", count: "0/0" },
  { id: "magiceden", name: "MAGIC EDEN NFTS", count: "0/0" },
  { id: "airdrops", name: "AIRDROPS", count: "0/0" },
];

const nfts = Array(12).fill({
  name: "NAME",
  number: "NO. 000",
});

export const NFTGallery = () => {
  const [activeCategory, setActiveCategory] = useState("kaiso");

  return (
    <section className="px-6 py-8 bg-background">
      {/* Category Tabs */}
      <div className="flex flex-wrap gap-4 mb-6 text-xs">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={cn(
              "transition-colors",
              activeCategory === cat.id
                ? "text-foreground font-medium"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {cat.name} <span className="ml-1">{cat.count}</span>
          </button>
        ))}
      </div>

      {/* NFT Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {nfts.map((nft, i) => (
          <div key={i} className="group cursor-pointer animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
            <div className="aspect-square rounded-lg bg-muted mb-2 relative overflow-hidden group-hover:ring-1 group-hover:ring-primary/50 transition-all">
              {/* Last item shows chart preview */}
              {i === 5 && (
                <div className="absolute inset-0 gradient-chart flex items-end p-2">
                  <div className="flex items-center gap-1 text-xs">
                    <span className="text-success font-mono">$34.56K</span>
                    <TrendingUp className="w-3 h-3 text-success" />
                  </div>
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{nft.name}</p>
            <p className="text-sm font-mono font-medium">{nft.number}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
