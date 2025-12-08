import { Header } from "./Header";
import { ProfileSection } from "./ProfileSection";
import { SkillsProjects } from "./SkillsProjects";
import { NFTGallery } from "./NFTGallery";
import { Markets } from "./Markets";
import { WalletTracker } from "./WalletTracker";

export const CryptoDashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <ProfileSection />
        <SkillsProjects />
        <NFTGallery />
        <Markets />
        <WalletTracker />
      </main>
    </div>
  );
};

export default CryptoDashboard;
