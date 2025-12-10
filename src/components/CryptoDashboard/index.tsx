import { Header } from "./Header";
import { ProfileSection } from "./ProfileSection";
import { SkillsProjects } from "./SkillsProjects";
import { NFTGallery } from "./NFTGallery";
import { Markets } from "./Markets";
import { WalletTracker } from "./WalletTracker";
import { Tabs } from "./Ta";
import { useState,useEffect } from "react";
import { GigCard } from "./GigCard";
import Tracker from "../Tracker";







// Define the Gig shape based on your backend schema
export interface Gig {
  blockchainGigId?: number;
  employer: string;
  worker?: string;
  title: string;
  description: string;
  paymentAmount: string; // stored as string in schema
  requiredBadge?: string;
  deadline: number;
  status: "OPEN" | "ASSIGNED" | "SUBMITTED" | "COMPLETED" | "CANCELLED" | string;
  featured?: boolean;
  featuredUntil?: string | Date;
  urgent?: boolean;
  txHash?: string;
  createdAt?: string | Date;
  completedAt?: string | Date;
  applications?: Array<{
    workerId?: string;
    coverLetter?: string;
    estimatedTime?: number;
    appliedAt?: string | Date;
  }>;
  _id?: string;
}


const gigsoo = [
  {
    blockchainGigId: 1,
    employer: "0x1234567890123456789012345678901234567890",
    worker: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
    title: "Build React Component Library",
    description:
      "Create a reusable component library with Storybook documentation and TypeScript support",
    paymentAmount: "2500.00",
    requiredBadge: "React",
    deadline: 1704067200,
    status: "COMPLETED",
    featured: true,
    featuredUntil: "2024-12-20T23:59:59Z",
    urgent: false,
    txHash: "0xabcd1234efgh5678ijkl9012mnop3456qrst7890",
    createdAt: "2024-01-10T10:00:00Z",
    completedAt: "2024-01-28T15:30:00Z",
    applications: [
      {
        workerId: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
        coverLetter:
          "I have 5+ years of React experience and have built similar libraries",
        estimatedTime: 14,
        appliedAt: "2024-01-10T12:00:00Z",
      },
      {
        workerId: "0xfedcbafedcbafedcbafedcbafedcbafedcbafed",
        coverLetter: "Great project! I love working with component systems",
        estimatedTime: 18,
        appliedAt: "2024-01-10T13:15:00Z",
      },
    ],
  },
  {
    blockchainGigId: 2,
    employer: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
    worker: "0xfedcbafedcbafedcbafedcbafedcbafedcbafed",
    title: "Design Mobile App UI Mockups",
    description:
      "Create high-fidelity mobile app mockups for iOS and Android platforms including user flows",
    paymentAmount: "1800.00",
    requiredBadge: "UI/UX Design",
    deadline: 1704326400,
    status: "SUBMITTED",
    featured: false,
    featuredUntil: null,
    urgent: true,
    txHash: "0x1234abcd5678efgh9012ijkl3456mnop7890qrst",
    createdAt: "2024-01-15T09:30:00Z",
    completedAt: null,    
    applications: [
      {
        workerId: "0xfedcbafedcbafedcbafedcbafedcbafedcbafed",    


        coverLetter:          "Experienced UI/UX designer with a portfolio of mobile apps",
        estimatedTime: 10,
        appliedAt: "2024-01-15T11:00:00Z",

      },
    ],
  },
];





export interface GigsApiResponse {
  success: boolean;
  gigs: Gig[];
  total: number;
  limit: number;
  skip: number;
}


export const CryptoDashboard = () => {

   const [activeTab, setActiveTab] = useState("GIGS");
   const [gigs, setGigs] = useState<Gig[]>([]);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);


   useEffect(() => {
    const fetchGigs = async () => {
      setLoading(true);
       setGigs(gigsoo);
      setError(null);
      try {
  // Prefer a Vite env var if provided, otherwise fallback to relative path
  const apiEnv = (import.meta as unknown as { env?: Record<string, string> }).env;
  const apiBase = apiEnv?.VITE_API_BASE || "http://localhost:3000";
  const res = await fetch(`${apiBase}/api/gigs`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: GigsApiResponse = await res.json();
        // setGigs(gigsoo);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error("Failed to fetch gigs:", msg);
        // setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchGigs();
  }, []);

  return (
    <div className="min-h-screen bg-foreground  text-black">
      <Header />
      <main>
        <ProfileSection />

         <section className="bg-background border-t border-border">
         <Tabs activeTab={activeTab} onTabChange={setActiveTab} />
         
         {activeTab === "GIGS" && (
           <div className="p-6 space-y-4">
             {loading && <div className="text-center">Loading gigs...</div>}
             {!loading && error && <div className="text-center text-red-500">Error: {error}</div>}
             {!loading && !error && gigs.length === 0 && (
               <div className="text-center text-muted-foreground">No gigs found.</div>
             )}
             {!loading && !error && gigs.map((gig, idx) => (
               <GigCard
                 key={idx}
                  id={idx}
                 status={gig.status}
                 description={gig.description}
                 price={Number(gig.paymentAmount) || 0}
               />
             ))}
           </div>
         )}
   
         {activeTab === "PROFILE" && (
           <div className="p-6 text-muted-foreground text-center py-12">
        
             <SkillsProjects />
             <NFTGallery />
             <Markets />
             <WalletTracker />
           </div>
         )}
   
         {activeTab === "TRACKER" && (
           <div className="p-6 text-muted-foreground text-center py-12">
      <Tracker/>
           </div>
         )}
       </section>

      </main>
    </div>
  );
};

export default CryptoDashboard;
