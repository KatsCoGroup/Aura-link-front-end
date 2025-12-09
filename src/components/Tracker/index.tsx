import { TrackerColumn } from "./TrackerColumn";
import { SocialSidebar } from "./SocialSidebar";

const trackerData = {
  start: Array(7).fill({ username: "@username" }),
  statues: Array(7).fill({ username: "@username", status: "In progress" }),
  feedback: Array(7).fill({ username: "@username" }),
  done: Array(7).fill({ username: "@username" }),
};

export const Tracker = () => {
  return (
    <section className="bg-background relative py-8 px-16 min-h-[500px]">
      {/* Social Sidebar */}
      <SocialSidebar />
      
      {/* Tracker Board */}
      <div className="flex gap-4 ml-16">
        <TrackerColumn 
          title="Start" 
          items={trackerData.start} 
          showConnector={true}
        />
        <TrackerColumn 
          title="Statues" 
          items={trackerData.statues} 
          showConnector={true}
        />
        <TrackerColumn 
          title="Feedback" 
          items={trackerData.feedback} 
          showConnector={true}
        />
        <TrackerColumn 
          title="Done" 
          items={trackerData.done} 
          showConnector={false}
        />
      </div>
    </section>
  );
};

export default Tracker;
