import { Header } from "./Header";
import { ProfileSection } from "./ProfileSection";
import { SkillsProjects } from "./SkillsProjects";
import { NFTGallery } from "./NFTGallery";
import { Markets } from "./Markets";
import { WalletTracker } from "./WalletTracker";
import { Tabs } from "./Ta";
import { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { GigCard } from "./GigCard";
import Tracker from "../Tracker";
import { GradientLoadingAnimation } from "../ui/Loading";
import { gigAPI, type Gig } from "@/services/api";

export const CryptoDashboard = () => {
  const [activeTab, setActiveTab] = useState("GIGS");
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const hashTab = useMemo(() => {
    const hash = (location.hash || "").toLowerCase();
    if (hash.includes("profile")) return "PROFILE";
    if (hash.includes("tracker")) return "TRACKER";
    if (hash.includes("gigs")) return "GIGS";
    return "GIGS";
  }, [location.hash]);

  useEffect(() => {
    const fetchGigs = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await gigAPI.getGigs();
        setGigs(data.gigs);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error("Failed to fetch gigs:", msg);
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchGigs();
  }, []);

  useEffect(() => {
    setActiveTab(hashTab);
  }, [hashTab]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    const nextHash = tab === "PROFILE" ? "#profile" : tab === "TRACKER" ? "#tracker" : "#gigs";
    navigate({ hash: nextHash }, { replace: true });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <section className="bg-background border-t border-border">
          <Tabs activeTab={activeTab} onTabChange={handleTabChange} />

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
                gigs.map((gig) => (
                  <GigCard
                    key={gig._id || gig.blockchainGigId}
                    gigId={gig._id || ''}
                    status={gig.status}
                    employer={gig.employer || ""}
                    description={gig.description}
                    title={gig.title}
                    price={Number(gig.paymentAmount) || 0}
                    imageUrl={gig.imageUrl}
                    featured={gig.featured}
                    featuredUntil={gig.featuredUntil}
                    urgent={gig.urgent}
                    requiredBadge={gig.requiredBadge}
                  />
                ))}
            </div>
          )}

          {activeTab === "PROFILE" && (
            <div className="p-0">
              <ProfileSection
                onGigCreated={(gig) => setGigs((prev) => [gig, ...prev])}
              />
              <div className="p-6 text-muted-foreground text-center py-12">
                <SkillsProjects />
                <NFTGallery />
                <Markets />
                <WalletTracker />
              </div>
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
