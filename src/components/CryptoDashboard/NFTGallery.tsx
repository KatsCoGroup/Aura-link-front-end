import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { TrendingUp } from "lucide-react";

type NFTItem = {
  name: string;
  number: string;
  floor: string;
};

const nftCollections: Array<{
  id: string;
  name: string;
  count: string;
  items: NFTItem[];
}> = [
  {
    id: "pudgy",
    name: "Pudgy Penguins",
    count: "10K",
    items: [
      { name: "Pudgy Penguin", number: "#6873", floor: "12.5 ETH" },
      { name: "Pudgy Penguin", number: "#1421", floor: "12.5 ETH" },
      { name: "Pudgy Penguin", number: "#4120", floor: "12.5 ETH" },
    ],
  },
  {
    id: "azuki",
    name: "Azuki",
    count: "10K",
    items: [
      { name: "Azuki", number: "#9217", floor: "6.4 ETH" },
      { name: "Azuki", number: "#2815", floor: "6.4 ETH" },
      { name: "Azuki", number: "#1022", floor: "6.4 ETH" },
    ],
  },
  {
    id: "bayc",
    name: "BAYC",
    count: "10K",
    items: [
      { name: "Bored Ape", number: "#1142", floor: "23.1 ETH" },
      { name: "Bored Ape", number: "#9910", floor: "23.1 ETH" },
      { name: "Bored Ape", number: "#6028", floor: "23.1 ETH" },
    ],
  },
  {
    id: "degods",
    name: "DeGods",
    count: "10K",
    items: [
      { name: "DeGods", number: "#2509", floor: "3.1 ETH" },
      { name: "DeGods", number: "#1120", floor: "3.1 ETH" },
      { name: "DeGods", number: "#0715", floor: "3.1 ETH" },
    ],
  },
];

export const NFTGallery = () => {
  const [activeCategory, setActiveCategory] = useState("pudgy");

  const activeItems = useMemo(() => {
    return nftCollections.find((c) => c.id === activeCategory)?.items ?? [];
  }, [activeCategory]);


  return (
    <section className="px-6 py-8 bg-background">
      
      {/* Category Tabs */}

      <div className="flex flex-wrap gap-4 mb-6 text-xs">
        {nftCollections.map((cat) => (
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
        {activeItems.map((nft, i) => (
          <div key={`${activeCategory}-${i}`} className="group cursor-pointer animate-fade-in" style={{ animationDelay: `${i * 40}ms` }}>
            <div className="aspect-square rounded-lg bg-gradient-to-br from-primary/20 via-muted to-muted-foreground/10 mb-2 relative overflow-hidden group-hover:ring-1 group-hover:ring-primary/50 transition-all flex items-center justify-center">
              <span className="text-sm font-semibold text-foreground">{nft.name.split(" ")[0]}</span>
              {i === 0 && (
                <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded text-[10px] font-mono flex items-center gap-1">
                  <span className="text-success">{nft.floor}</span>
                  <TrendingUp className="w-3 h-3 text-success" />
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
