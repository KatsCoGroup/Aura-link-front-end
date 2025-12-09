interface TrackerCardProps {
  username: string;
  status?: string;
  showConnector?: boolean;
}

export const TrackerCard = ({ username, status, showConnector = true }: TrackerCardProps) => {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 flex-1">
        {/* Avatar placeholder */}
        <div className="w-8 h-8 bg-muted rounded-md flex-shrink-0" />
        
        {/* Username or Status */}
        <span className="text-sm text-foreground">
          {status || username}
        </span>
      </div>
      
      {/* Connector line */}
      {showConnector && (
        <div className="w-16 h-0.5 bg-muted-foreground/30" />
      )}
    </div>
  );
};
