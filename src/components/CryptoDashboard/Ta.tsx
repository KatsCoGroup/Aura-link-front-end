import { cn } from "@/lib/utils";

interface TabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = ["PROFILE", "GIGS", "TRACKER"];

export const Tabs = ({ activeTab, onTabChange }: TabsProps) => {
  return (
    <div className="flex ">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={cn(
            "flex-1 py-4 text-sm font-medium tracking-widest transition-colors",
            activeTab === tab
              ? "text-foreground border-2 border-b-0 border-foreground rounded-t-lg"
              : "text-muted-foreground hover:text-foreground border-b-2 border-foreground"
          )}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};