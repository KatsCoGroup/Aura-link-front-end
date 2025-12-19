import { Header } from "./Header";
import { ProfileSection } from "./ProfileSection";
import { SkillsProjects } from "./SkillsProjects";
import { NFTGallery } from "./NFTGallery";
import { Markets } from "./Markets";
import { WalletTracker } from "./WalletTracker";
import { Tabs } from "./Ta";
import { useState, useEffect } from "react";
import { GigCard } from "./GigCard";
import Tracker from "../Tracker";
import { GradientLoadingAnimation } from "../ui/Loading";
import { BASE_URL } from "@/lib/constants";

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
  status:
    | "OPEN"
    | "ASSIGNED"
    | "SUBMITTED"
    | "COMPLETED"
    | "CANCELLED"
    | string;
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
  
      setError(null);
      try {
        // Prefer a Vite env var if provided, otherwise fallback to relative path
        const apiEnv = (
          import.meta as unknown as { env?: Record<string, string> }
        ).env;
       
        const res = await fetch(`${BASE_URL}/api/gigs`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: GigsApiResponse = await res.json();

       
        setGigs(data.gigs);
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
              {loading && (
                <div className="text-center">
                  <GradientLoadingAnimation />
                </div>
              )}
              {!loading && error && (
                <div className="text-center text-red-500">Error: {error}</div>
              )}
              {!loading && !error && gigs.length === 0 && (
                <div className="text-center text-muted-foreground">
                  No gigs found.
                </div>
              )}
              {!loading &&
                !error &&
                gigs.map((gig, idx) => (
                  <GigCard
                    key={idx}
                    id={idx}
                    status={gig.status}
                    employer={gig.employer || ""}
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
              <Tracker />
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default CryptoDashboard;
