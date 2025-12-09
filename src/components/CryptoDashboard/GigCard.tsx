import { User } from "lucide-react";
import JobApplicationDialog from "./GigApplication";
import JobApplicantsDialog from "./GigApplicants";

interface GigCardProps {
  id: number;
  status: string;
  description: string;
  price: number;
  biddersCount?: number;
}

export const GigCard = ({ id, status, description, price, biddersCount = 8 }: GigCardProps) => {
  const bidders = Array.from({ length: biddersCount }, (_, i) => i);

  return (
    <div className="flex items-center gap-6 py-6 border border-dashed border-border rounded-xl px-6">
      {/* Left Section - Avatar, Status, Description, Price */}
      <div className="flex items-center gap-4 flex-1">
        {/* Avatar */}
        <div className="w-16 h-16 bg-muted rounded-xl flex items-center justify-center flex-shrink-0">
          <User className="w-8 h-8 text-muted-foreground" />
        </div>

        {/* Status & Description */}
        <div className="flex-1 min-w-0">
          <span className="inline-block px-2 py-0.5 bg-green-500 text-black text-xs font-semibold rounded mb-1">
            {status}
          </span>
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
            {description}
          </p>
        </div>

        {/* Price */}
        <div className="text-2xl font-bold text-foreground flex-shrink-0">
          ${price}
        </div>
      </div>

      {/* Divider */}
      <div className="w-px h-16 bg-border" />

      {/* Right Section - Bidding */}
      <div className="flex items-center gap-6">
        {status == "You Posted" ? "" : (""

        //   <div>
          // <p className="text-sm font-semibold text-foreground mb-2">Bidding</p>
          // <div className="grid grid-cols-4 gap-1.5">
          //   {bidders.map((i) => (
          //     <div
          //     key={i}
          //     className="w-6 h-6 rounded-full bg-muted-foreground/40"
          //     />
          //   ))}
          // </div>
        // </div>

     
          )}

        {/* Token */}
        <div className="text-xl font-semibold text-foreground"> {status == "You Posted" ? (<JobApplicantsDialog id={id}/>) : (<JobApplicationDialog id={id} />)} 
   
                </div>
      </div>
    </div>
  );
};