import { User } from "lucide-react";
import JobApplicationDialog from "./GigApplication";
import JobApplicantsDialog from "./GigApplicants";
import { useWallet } from "@/hooks/use-wallet";

interface GigCardProps {
  id: number;
  status: string;
  employer: string;
  description: string;
  
  price: number;
  biddersCount?: number;
}

export const GigCard = ({ id, status, description, price, biddersCount = 8, employer }: GigCardProps) => {
  const bidders = Array.from({ length: biddersCount }, (_, i) => i);
  const {account} = useWallet()

  const statusColors: Record<string, string> = {
    OPEN: "bg-[#22C55E]",
    ASSIGNED: "bg-[#3B82F6]",
    SUBMITTED: "bg-[#8B5CF6]",
    COMPLETED: "bg-[#FACC15]",
    CANCELLED: "bg-[#EF4444]",
  };

  const statusBg = statusColors[status] || "bg-green-500";

  return (
    <div className="flex flex-col md:flex-row items-center gap-6 py-6 rounded-xl px-6">
      {/* Left Section - Avatar, Status, Description, Price */}
      <div className="flex items-center gap-4 w-full md:w-1/2">
        {/* Avatar */}
        <div className="w-16 h-16 bg-gray-900 rounded-xl border-2 border-dashed border-gray-600 flex items-center justify-center flex-shrink-0">
          <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
            <User className="w-6 h-6 text-gray-400" />
          </div>
        </div>

        {/* Status & Description */}
        <div className="flex-1 min-w-0">
          <span className={`inline-block px-2 py-0.5 ${statusBg} text-black text-xs font-semibold rounded mb-1`}>
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
      <div className="hidden md:block w-px h-16 bg-border" />

      {/* Right Section - Bidding */}
      <div className="flex items-center gap-6 w-full md:flex-1 justify-between md:justify-end">
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
        <div className="text-xl font-semibold text-foreground"> {employer?.toLowerCase() === account?.toLowerCase() ? (<JobApplicantsDialog id={id} />) : (<JobApplicationDialog id={id} />)}

        </div>
      </div>
    </div>
  );
};