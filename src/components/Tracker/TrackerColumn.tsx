import { TrackerCard } from "./TrackerCard";

interface TrackerColumnProps {
  title: string;
  items: { username: string; status?: string }[];
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
            username={item.username}
            status={item.status}
            showConnector={showConnector}
          />
        ))}
      </div>
    </div>
  );
};
