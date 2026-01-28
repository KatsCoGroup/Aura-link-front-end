interface TrackerCardProps {
  title: string;
  status?: string;
  meta?: string;
  imageUrl?: string;
  showConnector?: boolean;
}

export const TrackerCard = ({ title, status, meta, imageUrl, showConnector = true }: TrackerCardProps) => {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 flex-1">
        <div className="w-10 h-10 rounded bg-muted overflow-hidden flex-shrink-0">
          {imageUrl ? (
            <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-muted" />
          )}
        </div>

        <div className="flex flex-col">
          <span className="text-sm text-foreground font-medium line-clamp-1">{title}</span>
          <span className="text-xs text-muted-foreground line-clamp-1">
            {status || meta || ""}
          </span>
        </div>
      </div>

      {/* Connector line */}
      {showConnector && (
        <div className="hidden md:block w-16 h-0.5 bg-muted-foreground/30" />
      )}
    </div>
  );
};
