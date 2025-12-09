import { Header } from "./Header";
import { ProfileSection } from "./ProfileSection";
import { SkillsProjects } from "./SkillsProjects";
import { NFTGallery } from "./NFTGallery";
import { Markets } from "./Markets";
import { WalletTracker } from "./WalletTracker";
import { Tabs } from "./Ta";
import { useState } from "react";
import { GigCard } from "./GigCard";
import Tracker from "../Tracker";





const gigsData = [
  {
    id: 1,
    status: "Hiring",
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been",
    price: 90,
  },
  {
    id: 2,
    status: "Hiring",
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been",
    price: 90,
  },
  {
    id: 3,
    status: "You Posted",
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been",
    price: 90,
  },
  {
    id: 4,
    status: "Hiring",
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been",
    price: 90,
  },
];



export const CryptoDashboard = () => {

   const [activeTab, setActiveTab] = useState("GIGS");
     
  
  return (
    <div className="min-h-screen bg-foreground  text-black">
      <Header />
      <main>
        <ProfileSection />

         <section className="bg-background border-t border-border">
         <Tabs activeTab={activeTab} onTabChange={setActiveTab} />
         
         {activeTab === "GIGS" && (
           <div className="p-6 space-y-4">
             {gigsData.map((gig) => (
               <GigCard
                 key={gig.id}
                  id={gig.id}
                 status={gig.status}
                 description={gig.description}
                 price={gig.price}
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
