import { TrackerCard } from "./TrackerCard";

interface TrackerColumnProps {
  title: string;
  items: { title: string; status?: string; meta?: string; imageUrl?: string }[];
  showConnector?: boolean;
}

export const TrackerColumn = ({ title, items, showConnector = true }: TrackerColumnProps) => {
  return (
    <div className="flex-1">
      {/* Column Header */}
      <h3 className="text-lg font-semibold text-foreground text-center mb-6">
        {title}
      </h3>
      
      {/* Cards */}
      <div className="space-y-4">
        {items.map((item, index) => (
          <TrackerCard
            key={index}
            title={item.title}
            status={item.status}
            meta={item.meta}
            imageUrl={item.imageUrl}
            showConnector={showConnector}
          />
        ))}
      </div>
    </div>
  );
};
